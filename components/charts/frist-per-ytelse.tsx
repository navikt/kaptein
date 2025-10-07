'use client';

import { useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/charts/common/common-chart-props';
import { ExceededFrist, getFristColor } from '@/components/charts/common/use-frist-color';
import { NoData } from '@/components/no-data/no-data';
import { TODAY } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, Frist, IKodeverkSimpleValue } from '@/lib/types';

interface Props {
  behandlinger: (BaseBehandling & Frist)[];
  relevantYtelser: IKodeverkSimpleValue[];
}

const TITLE = 'Frist per ytelse';

const getData = (behandling: Frist, exceeded: ExceededFrist): number => {
  switch (exceeded) {
    case ExceededFrist.NULL:
      return behandling.frist === null ? 1 : 0;
    case ExceededFrist.EXCEEDED:
      return behandling.frist !== null && behandling.frist < TODAY ? 1 : 0;
    case ExceededFrist.NOT_EXCEEDED:
      return behandling.frist !== null && behandling.frist >= TODAY ? 1 : 0;
  }
};

export const FristPerYtelse = ({ behandlinger, relevantYtelser }: Props) => {
  const series = useMemo(
    () =>
      Object.values(ExceededFrist).map((type) => ({
        ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
        name: type,
        color: getFristColor(type),
        data: relevantYtelser
          .map(({ id }) =>
            behandlinger.reduce((acc, curr) => (curr.ytelseId === id ? acc + getData(curr, type) : acc), 0),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, relevantYtelser],
  );

  const labels = useMemo(
    () => relevantYtelser.map((y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`),
    [relevantYtelser, series],
  );

  if (behandlinger.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <EChart
      title={TITLE}
      description={`Viser data for ${behandlinger.length} saker`}
      option={{
        ...COMMON_STACKED_BAR_CHART_PROPS,
        yAxis: { type: 'category', data: labels },
        series,
      }}
    />
  );
};
