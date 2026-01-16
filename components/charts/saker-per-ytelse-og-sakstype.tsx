'use client';

import { useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/charts/common/common-chart-props';
import { getYtelseIdsForEntry, useYtelseChartData } from '@/components/charts/common/use-ytelse-chart-data';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import { getSakstypeColor } from '@/lib/echarts/get-colors';
import type { BaseBehandling, IKodeverkSimpleValue, Sakstype } from '@/lib/types';

interface Props {
  title: string;
  description: string;
  behandlinger: BaseBehandling[];
  relevantYtelser: IKodeverkSimpleValue[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
}

export const SakerPerYtelseOgSakstype = ({ title, description, behandlinger, relevantYtelser, sakstyper }: Props) => {
  const entries = useYtelseChartData(behandlinger, relevantYtelser);

  const series = useMemo(
    () =>
      sakstyper.map((type) => ({
        ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
        name: type.navn,
        color: getSakstypeColor(type.id),
        data: entries
          .map((entry) => countSakstype(behandlinger, getYtelseIdsForEntry(entry), type.id))
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, entries, sakstyper],
  );

  const labels = useMemo(
    () =>
      entries.map(
        (entry, i) =>
          `${entry.navn} (${series
            .filter(({ data }) => data.some((d) => d !== null))
            .reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`,
      ),
    [entries, series],
  );

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      option={{
        ...COMMON_STACKED_BAR_CHART_PROPS,
        yAxis: { type: 'category', data: labels },
        series,
      }}
    />
  );
};

/**
 * Count behandlinger for a list of ytelseIds with a specific sakstype
 */
const countSakstype = (behandlinger: BaseBehandling[], ytelseIds: string[], sakstypeId: string): number =>
  behandlinger.reduce(
    (acc, curr) => (ytelseIds.includes(curr.ytelseId) && curr.typeId === sakstypeId ? acc + 1 : acc),
    0,
  );
