'use client';

import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue, IYtelse } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  ytelsekodeverk: IYtelse[];
  klageenheterkodeverk: IKodeverkSimpleValue[];
}

export const SakerPerYtelseOgKlageenhet = ({ behandlinger, ytelsekodeverk, klageenheterkodeverk }: Props) => {
  const relevantYtelser = useMemo(() => {
    const ids = Array.from(new Set(behandlinger.map((b) => b.ytelseId)));

    return ids
      .map((id) => {
        const kodeverk = ytelsekodeverk.find((k) => k.id === id);

        return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
      })
      .toSorted((a, b) => a.navn.localeCompare(b.navn));
  }, [behandlinger, ytelsekodeverk]);

  const series = useMemo(
    () =>
      [...klageenheterkodeverk, { id: null, navn: 'Ikke tildelt' }].map((enhet) => ({
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
    [behandlinger, relevantYtelser, klageenheterkodeverk],
  );

  const labels = relevantYtelser.map(
    (y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`,
  );

  return (
    <EChart
      option={{
        title: {
          text: 'Saker per ytelse og klageenhet',
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
