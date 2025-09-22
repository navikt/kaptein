'use client';

import { useMemo } from 'react';
import { COMMON_BAR_CHART_PROPS } from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { FerdigstiltBehandling, IKodeverkSimpleValue, TildeltBehandling } from '@/lib/server/types';

interface Props {
  title: string;
  behandlinger: (TildeltBehandling | FerdigstiltBehandling)[];
  klageenheter: IKodeverkSimpleValue[];
}

export const TildelteSakerPerKlageenhet = ({ behandlinger, klageenheter, title }: Props) => {
  const data = useMemo<{ name: string; value: number }[]>(() => {
    const map = new Map<string | null, { value: number; name: string }>();

    behandlinger.forEach((b) => {
      const existing = map.get(b.tildeltEnhet);

      if (existing) {
        existing.value += 1;
      } else {
        map.set(b.tildeltEnhet, {
          name: klageenheter.find((k) => k.id === b.tildeltEnhet)?.navn ?? b.tildeltEnhet,
          value: 1,
        });
      }
    });

    return Object.values(Object.fromEntries(map));
  }, [behandlinger, klageenheter]);

  const labels = useMemo(() => data.map((d) => d.name), [data]);
  const values = useMemo(() => data.map((d) => d.value), [data]);

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      option={{
        ...COMMON_BAR_CHART_PROPS,
        title: { text: title, subtext: `Viser data for ${behandlinger.length} tildelte saker` },
        yAxis: { type: 'category', data: labels },
        series: [{ data: values, type: 'bar' }],
      }}
    />
  );
};
