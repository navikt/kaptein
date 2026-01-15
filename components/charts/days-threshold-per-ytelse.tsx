'use client';

import { VStack } from '@navikt/ds-react';
import { type ReactNode, useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/charts/common/common-chart-props';
import { DayPicker } from '@/components/charts/common/day-picker';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import { formatInt } from '@/lib/format';
import { percent } from '@/lib/percent';
import { useAlderPerYtelseMaxDaysFilter } from '@/lib/query-state/query-state';
import type { BaseBehandling, IKodeverkSimpleValue } from '@/lib/types';

interface Props<T extends BaseBehandling> {
  title: string;
  description: string;
  helpText: ReactNode;
  behandlinger: T[];
  relevantYtelser: IKodeverkSimpleValue[];
  getDays?: (b: T) => number;
  exceededName?: string;
  withinName?: string;
}

export const DaysThresholdPerYtelse = <T extends BaseBehandling>({
  title,
  description,
  behandlinger,
  relevantYtelser,
  getDays = (b) => b.ageKA,
  exceededName = 'Over',
  withinName = 'Innenfor',
  helpText,
}: Props<T>) => {
  const [maxDays, setMaxDays] = useAlderPerYtelseMaxDaysFilter();

  const { overSeriesData, underSeriesData, labels } = useMemo(() => {
    const overMap: Map<string, number> = new Map();
    const underMap: Map<string, number> = new Map();
    const threshold = maxDays ?? 0;

    for (const behandling of behandlinger) {
      const days = getDays(behandling);

      if (days > threshold) {
        const existing = overMap.get(behandling.ytelseId);
        overMap.set(behandling.ytelseId, existing === undefined ? 1 : existing + 1);
      } else {
        const existing = underMap.get(behandling.ytelseId);
        underMap.set(behandling.ytelseId, existing === undefined ? 1 : existing + 1);
      }
    }

    const overSeriesData: (number | null)[] = [];
    const underSeriesData: (number | null)[] = [];
    const labels: string[] = [];

    for (const ytelse of relevantYtelser) {
      const overCount = overMap.get(ytelse.id);
      overSeriesData.push(overCount ?? null);

      const underCount = underMap.get(ytelse.id);
      underSeriesData.push(underCount ?? null);

      const totalCount = (overCount ?? 0) + (underCount ?? 0);

      labels.push(`${ytelse.navn} (${formatInt(totalCount)})`);
    }

    return { overSeriesData, underSeriesData, labels };
  }, [relevantYtelser, behandlinger, getDays, maxDays]);

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <VStack justify="center" align="center" gap="space-16" className="h-full">
      <DayPicker value={maxDays} setValue={setMaxDays} title={title} options={DAY_PICKER_OPTIONS} />
      <EChart
        title={title}
        description={description}
        helpText={helpText}
        option={{
          ...COMMON_STACKED_BAR_CHART_PROPS,
          tooltip: {
            ...COMMON_STACKED_BAR_CHART_PROPS.tooltip,
            formatter: (params: unknown) => {
              if (!Array.isArray(params)) {
                return '';
              }

              let tooltip = `${params[0].axisValue}<br/>`;

              // Calculate total for percentage
              const total = params.reduce((sum, param) => {
                const count = typeof param.data === 'number' ? param.data : 0;
                return sum + count;
              }, 0);

              params.forEach((param) => {
                const count = typeof param.data === 'number' ? param.data : 0;
                const percentage = percent(count, total);
                tooltip += `${param.marker} ${param.seriesName}: ${percentage} (${count} saker)<br/>`;
              });

              return tooltip;
            },
          },
          yAxis: { type: 'category', data: labels },
          series: [
            {
              ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
              name: exceededName,
              data: overSeriesData,
              color: 'var(--ax-danger-600)',
            },
            {
              ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
              name: withinName,
              data: underSeriesData,
              color: 'var(--ax-accent-500)',
            },
          ],
        }}
      />
    </VStack>
  );
};

const TWELVE_WEEKS_IN_DAYS = 12 * 7;
const FIFTEEN_WEEKS_IN_DAYS = 15 * 7;

const DAY_PICKER_OPTIONS = [
  { numDays: TWELVE_WEEKS_IN_DAYS, label: '12 uker' },
  { numDays: FIFTEEN_WEEKS_IN_DAYS, label: '15 uker' },
];
