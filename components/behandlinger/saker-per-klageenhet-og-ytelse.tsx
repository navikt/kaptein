'use client';

import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue, IYtelse } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  ytelsekodeverk: IYtelse[];
  klageenheterkodeverk: IKodeverkSimpleValue[];
  sakstyperkoderverk: IKodeverkSimpleValue[];
}

export const SakerPerKlageenhetOgYtelse = ({
  behandlinger,
  ytelsekodeverk,
  klageenheterkodeverk,
  sakstyperkoderverk,
}: Props) => {
  const filteredBehandlinger = useMemo(() => behandlinger.filter((b) => b.tildeltEnhet !== null), [behandlinger]);

  const relevantYtelser = useMemo(() => {
    const ids = Array.from(new Set(filteredBehandlinger.map((b) => b.ytelseId)));

    return ids
      .map((id) => {
        const kodeverk = ytelsekodeverk.find((k) => k.id === id);

        return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
      })
      .toSorted((a, b) => a.navn.localeCompare(b.navn));
  }, [filteredBehandlinger, ytelsekodeverk]);

  const series = useMemo(
    () =>
      relevantYtelser.map((ytelse) => ({
        type: 'bar',
        stack: 'total',
        label: { show: true },
        emphasis: { focus: 'series' },
        name: ytelse.navn,
        data: klageenheterkodeverk
          .map(({ id }) =>
            behandlinger.reduce(
              (acc, curr) => (curr.tildeltEnhet === id && curr.ytelseId === ytelse.id ? acc + 1 : acc),
              0,
            ),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, relevantYtelser, klageenheterkodeverk],
  );

  return (
    <EChart
      option={{
        title: {
          text: 'Saker per klageenhet og ytelse',
          subtext: `Totalt: ${filteredBehandlinger.length} tildelte saker`,
        },
        tooltip: {
          confine: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          type: 'scroll',
        },
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
