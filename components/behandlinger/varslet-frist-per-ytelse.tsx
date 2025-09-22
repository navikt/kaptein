'use client';

import { isBefore } from 'date-fns';
import { useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/behandlinger/common-chart-props';
import { ExceededFrist, getFristColor } from '@/components/behandlinger/use-frist-color';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  relevantYtelser: IKodeverkSimpleValue[];
}

const TODAY = new Date();

const TITLE = 'Varslet frist per ytelse';

const getData = (behandling: Behandling, exceeded: ExceededFrist): number => {
  switch (exceeded) {
    case ExceededFrist.NULL:
      return behandling.varsletFrist === null ? 1 : 0;
    case ExceededFrist.EXCEEDED:
      return behandling.varsletFrist !== null && isBefore(new Date(behandling.varsletFrist), TODAY) ? 1 : 0;
    case ExceededFrist.NOT_EXCEEDED:
      return behandling.varsletFrist !== null && !isBefore(new Date(behandling.varsletFrist), TODAY) ? 1 : 0;
  }
};

export const VarsletFristPerYtelse = ({ behandlinger, relevantYtelser }: Props) => {
  const series = useMemo(
    () =>
      Object.values(ExceededFrist).map((type) => ({
        ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
        name: type,
        color: getFristColor(type),
        data: relevantYtelser
          .map(({ id }) =>
            behandlinger.reduce((acc, curr) => {
              return curr.ytelseId === id ? acc + getData(curr, type) : acc;
            }, 0),
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
      option={{
        ...COMMON_STACKED_BAR_CHART_PROPS,
        title: { text: TITLE, subtext: `Viser data for ${behandlinger.length} saker` },
        yAxis: { type: 'category', data: labels },
        series,
      }}
    />
  );
};
