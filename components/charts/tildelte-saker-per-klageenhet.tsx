'use client';

import { useMemo } from 'react';
import { COMMON_BAR_CHART_PROPS } from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { IKodeverkSimpleValue } from '@/lib/types';

interface Props {
  title: string;
  description: string;
  behandlinger: { tildeltEnhet: string }[];
  klageenheter: IKodeverkSimpleValue[];
}

export const TildelteSakerPerKlageenhet = ({ behandlinger, klageenheter, title, description }: Props) => {
  const klageenheterMap = useMemo(() => {
    const map = new Map<string, string>();

    for (const { id, navn } of klageenheter) {
      map.set(id, navn);
    }

    return map;
  }, [klageenheter]);

  const data = useMemo<{ name: string; value: number }[]>(() => {
    const map = new Map<string | null, { value: number; name: string }>();

    behandlinger.forEach((b) => {
      const existing = map.get(b.tildeltEnhet);

      if (existing) {
        existing.value += 1;
      } else {
        map.set(b.tildeltEnhet, {
          name: klageenheterMap.get(b.tildeltEnhet) ?? b.tildeltEnhet,
          value: 1,
        });
      }
    });

    return Object.values(Object.fromEntries(map));
  }, [behandlinger, klageenheterMap]);

  const labels = useMemo(() => data.map((d) => d.name), [data]);
  const values = useMemo(() => data.map((d) => d.value), [data]);

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      option={{
        ...COMMON_BAR_CHART_PROPS,
        yAxis: { type: 'category', data: labels },
        series: [{ data: values, type: 'bar', name: 'Tildelte saker' }],
      }}
    />
  );
};
