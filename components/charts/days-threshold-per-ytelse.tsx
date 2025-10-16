'use client';

import { VStack } from '@navikt/ds-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/charts/common/common-chart-props';
import { DayPicker } from '@/components/charts/common/day-picker';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, IKodeverkSimpleValue } from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props<T extends BaseBehandling> {
  title: string;
  description: string;
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
}: Props<T>) => {
  const [maxDays, setMaxDays] = useQueryState(QueryParam.ALDER_PER_YTELSE_MAX_DAYS, parseAsInteger);

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

      labels.push(`${ytelse.navn} (${totalCount})`);
    }

    return { overSeriesData, underSeriesData, labels };
  }, [relevantYtelser, behandlinger, getDays, maxDays]);

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <VStack justify="center" align="center" gap="4" className="h-full">
      <DayPicker value={maxDays} setValue={setMaxDays} title={title} options={DAY_PICKER_OPTIONS} />
      <EChart
        title={title}
        description={description}
        height="auto"
        className="grow"
        option={{
          ...COMMON_STACKED_BAR_CHART_PROPS,
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

const DAY_PICKER_OPTIONS = [
  {
    numDays: 12 * 7,
    label: '12 uker',
  },
  {
    numDays: 15 * 7,
    label: '15 uker',
  },
];
