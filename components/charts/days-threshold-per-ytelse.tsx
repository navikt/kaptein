'use client';

import { VStack } from '@navikt/ds-react';
import { type ReactNode, useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/charts/common/common-chart-props';
import { DayPicker } from '@/components/charts/common/day-picker';
import { getYtelseIdsForEntry, useYtelseChartData } from '@/components/charts/common/use-ytelse-chart-data';
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
  const entries = useYtelseChartData(behandlinger, relevantYtelser);

  const { overSeriesData, underSeriesData, labels } = useMemo(() => {
    const threshold = maxDays ?? 0;

    const overSeriesData: (number | null)[] = [];
    const underSeriesData: (number | null)[] = [];
    const labels: string[] = [];

    for (const entry of entries) {
      const ytelseIds = getYtelseIdsForEntry(entry);
      const { overCount, underCount } = countOverUnder(behandlinger, ytelseIds, threshold, getDays);

      overSeriesData.push(overCount > 0 ? overCount : null);
      underSeriesData.push(underCount > 0 ? underCount : null);

      const totalCount = overCount + underCount;
      labels.push(`${entry.navn} (${formatInt(totalCount)})`);
    }

    return { overSeriesData, underSeriesData, labels };
  }, [entries, behandlinger, getDays, maxDays]);

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

/**
 * Count behandlinger for a list of ytelseIds over/under threshold
 */
const countOverUnder = <T extends BaseBehandling>(
  behandlinger: T[],
  ytelseIds: string[],
  threshold: number,
  getDays: (b: T) => number,
): { overCount: number; underCount: number } => {
  let overCount = 0;
  let underCount = 0;

  for (const behandling of behandlinger) {
    if (ytelseIds.includes(behandling.ytelseId)) {
      if (getDays(behandling) > threshold) {
        overCount++;
      } else {
        underCount++;
      }
    }
  }

  return { overCount, underCount };
};

const TWELVE_WEEKS_IN_DAYS = 12 * 7;
const FIFTEEN_WEEKS_IN_DAYS = 15 * 7;

const DAY_PICKER_OPTIONS = [
  { numDays: TWELVE_WEEKS_IN_DAYS, label: '12 uker' },
  { numDays: FIFTEEN_WEEKS_IN_DAYS, label: '15 uker' },
];
