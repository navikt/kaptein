'use client';

import { useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/behandlinger/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import { getSakstypeColor } from '@/lib/echarts/get-colors';
import type { Behandling, IKodeverkSimpleValue, Sakstype } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  relevantYtelser: IKodeverkSimpleValue[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
}

const TITLE = 'Saker per ytelse og sakstype';

export const SakerPerYtelseOgSakstype = ({ behandlinger, relevantYtelser, sakstyper }: Props) => {
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

  if (behandlinger.length === 0) {
    return <NoData title={TITLE} />;
  }

  const labels = relevantYtelser.map(
    (y, i) =>
      `${y.navn} (${series
        .filter(({ data }) => data.some((d) => d !== null))
        .reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`,
  );

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
