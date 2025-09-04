'use client';

import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue, IYtelse } from '@/lib/server/types';

interface Props {
  total: number;
  behandlinger: Behandling[];
  ytelser: IYtelse[];
  sakstyper: IKodeverkSimpleValue[];
}

export const SakerPerYtelse = ({ behandlinger, ytelser, sakstyper }: Props) => {
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
      sakstyper.map((type) => ({
        type: 'bar',
        stack: 'total',
        label: { show: true },
        emphasis: { focus: 'series' },
        name: type.navn,
        data: relevantYtelser
          .map(({ id }) =>
            behandlinger.reduce((acc, curr) => (curr.ytelseId === id && curr.typeId === type.id ? acc + 1 : acc), 0),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, relevantYtelser, sakstyper],
  );

  const labels = relevantYtelser.map(({ navn }) => navn);

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
