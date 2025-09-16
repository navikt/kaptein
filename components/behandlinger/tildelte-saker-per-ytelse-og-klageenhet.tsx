'use client';

import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue } from '@/lib/server/types';

interface Props {
  title: string;
  behandlinger: Behandling[];
  relevantYtelser: IKodeverkSimpleValue[];
  klageenheter: IKodeverkSimpleValue[];
}

export const TildelteSakerPerYtelseOgKlageenhet = ({
  behandlinger,
  relevantYtelser,
  klageenheter: klageenheterkodeverk,
  title,
}: Props) => {
  const series = useMemo(
    () =>
      [...klageenheterkodeverk].map((enhet) => ({
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

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  const labels = relevantYtelser.map(
    (y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`,
  );

  return (
    <EChart
      option={{
        title: {
          text: title,
          subtext: `Viser data for ${behandlinger.length} tildelte saker`,
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
