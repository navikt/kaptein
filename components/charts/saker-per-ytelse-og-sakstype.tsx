'use client';

import { useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/charts/common/common-chart-props';
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
  const series = useMemo(
    () =>
      sakstyper.map((type) => ({
        ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
        name: type.navn,
        color: getSakstypeColor(type.id),
        data: relevantYtelser
          .map(({ id }) =>
            behandlinger.reduce((acc, curr) => (curr.ytelseId === id && curr.typeId === type.id ? acc + 1 : acc), 0),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, relevantYtelser, sakstyper],
  );

  const labels = useMemo(
    () =>
      relevantYtelser.map(
        (y, i) =>
          `${y.navn} (${series
            .filter(({ data }) => data.some((d) => d !== null))
            .reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`,
      ),
    [relevantYtelser, series],
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
