'use client';

import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue, IYtelse } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  ytelsekodeverk: IYtelse[];
  klageenheterkodeverk: IKodeverkSimpleValue[];
}

export const SakerPerKlageenhetOgYtelse = ({ behandlinger, ytelsekodeverk, klageenheterkodeverk }: Props) => {
  const series = useMemo(
    () =>
      ytelsekodeverk.map((ytelse) => ({
        type: 'bar',
        stack: 'total',
        label: { show: true },
        emphasis: { focus: 'series' },
        name: ytelse.navn,
        data: klageenheterkodeverk
          .map(({ id }) =>
            behandlinger.reduce(
              (acc, curr) => (curr.ytelseId === id && curr.tildeltEnhet === ytelse.id ? acc + 1 : acc),
              0,
            ),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, ytelsekodeverk, klageenheterkodeverk],
  );

  return (
    <EChart
      option={{
        title: {
          text: 'Saker per klageenhet og ytelse',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: klageenheterkodeverk.map((y) => y.navn),
        },
        series,
      }}
    />
  );
};
