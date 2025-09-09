'use client';

import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import { getSakstypeColor } from '@/lib/echarts/get-colors';
import type { Behandling, IKodeverkSimpleValue, Sakstype } from '@/lib/server/types';

interface Props {
  total: number;
  behandlinger: Behandling[];
  relevantYtelser: IKodeverkSimpleValue[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
}

export const SakerPerYtelse = ({ behandlinger, relevantYtelser, sakstyper }: Props) => {
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

  const labels = relevantYtelser.map(
    (y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`,
  );

  return (
    <EChart
      option={{
        title: {
          text: 'Saker per ytelse og sakstype',
          subtext: `Viser data for ${behandlinger.length} saker`,
        },
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
