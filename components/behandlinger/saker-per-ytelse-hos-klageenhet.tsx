'use client';

import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue, IYtelse } from '@/lib/server/types';

interface Props {
  total: number;
  behandlinger: Behandling[];
  ytelser: IYtelse[];
  klageenheter: IKodeverkSimpleValue[];
}

export const SakerPerYtelseHosKlageenhet = ({ behandlinger, total, ytelser, klageenheter }: Props) => {
  const relevantYtelser = useMemo(() => {
    const ids = Array.from(new Set(behandlinger.map((b) => b.ytelseId)));

    return ids
      .map((id) => {
        const kodeverk = ytelser.find((k) => k.id === id);

        return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
      })
      .toSorted((a, b) => a.navn.localeCompare(b.navn));
  }, [behandlinger, ytelser]);

  const series = useMemo(
    () =>
      [...klageenheter, { id: null, navn: 'Ikke tildelt' }].map((enhet) => ({
        type: 'bar',
        stack: 'total',
        label: { show: true },
        emphasis: { focus: 'series' },
        name: enhet.navn,
        data: relevantYtelser
          .map(({ id }) =>
            behandlinger.reduce(
              (acc, curr) => (curr.ytelseId === id && curr.tildeltEnhet === enhet.id ? acc + 1 : acc),
              0,
            ),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, relevantYtelser, klageenheter],
  );

  return (
    <EChart
      option={{
        title: {
          text: 'Saker per ytelse hos klageenhet',
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
          data: relevantYtelser.map((y) => y.navn),
        },
        series,
      }}
    />
  );
};
