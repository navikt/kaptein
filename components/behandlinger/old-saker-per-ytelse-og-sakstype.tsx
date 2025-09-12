'use client';

import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import { getSakstypeColor } from '@/lib/echarts/get-colors';
import type { Behandling, IKodeverkSimpleValue, Sakstype } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  relevantYtelser: IKodeverkSimpleValue[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
}

const TITLE = 'Saker per ytelse og sakstype (gammel)';

export const SakerPerYtelseOgSakstype = ({ behandlinger, relevantYtelser, sakstyper }: Props) => {
  const series = useMemo(
    () =>
      sakstyper.map((type) => ({
        type: 'bar',
        stack: 'total',
        label: { show: true },
        emphasis: { focus: 'series' },
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
        title: {
          text: TITLE,
          subtext: `Viser data for ${behandlinger.length} saker`,
        },
        legend: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: labels,
        },
        series,
      }}
    />
  );
};
