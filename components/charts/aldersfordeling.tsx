'use client';

import type { ECharts } from 'echarts/core';
import { useEffect, useMemo, useState } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, Ledig, Tildelt } from '@/lib/types';

type Bucket = { aktive: number; label: string };
type Buckets = Record<number, Bucket>;

interface Props {
  uferdigeList: (BaseBehandling & (Ledig | Tildelt))[];
}

interface Data {
  labels: string[];
  aktive: number[];
}

const TITLE = 'Aldersfordeling';

export const Aldersfordeling = ({ uferdigeList }: Props) => {
  const [eChartsInstance, setEChartsInstance] = useState<ECharts>();

  useEffect(() => {
    if (eChartsInstance === undefined) {
      return;
    }

    eChartsInstance
      .getZr()
      .on('dblclick', () => eChartsInstance.dispatchAction({ type: 'dataZoom', start: 0, end: 100 }));

    return () => eChartsInstance.getZr().off('dblclick');
  }, [eChartsInstance]);

  const { labels, aktive } = useMemo<Data>(() => {
    const maxAge = uferdigeList.reduce((max, b) => (b.ageKA > max ? b.ageKA : max), 0);

    const buckets: Buckets = new Array(Math.floor(maxAge / 7) + 1).fill(null).reduce<Buckets>((acc, _, i) => {
      acc[i] = { aktive: 0, label: `${i}-${i + 1} uker` };

      return acc;
    }, {});

    for (const b of uferdigeList) {
      const index = Math.floor(b.ageKA / 7);

      buckets[index].aktive += 1;
    }

    const values = Object.values(buckets);

    return {
      labels: values.map((b) => b.label),
      aktive: values.map((b) => b.aktive),
    };
  }, [uferdigeList]);

  if (uferdigeList.length === 0 || labels.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <EChart
      title={TITLE}
      description={`Viser data for ${uferdigeList.length} aktive saker`}
      getInstance={setEChartsInstance}
      option={{
        grid: { bottom: 150 },
        dataZoom: [{ type: 'slider' }],
        yAxis: [{ type: 'value', name: 'Antall' }],
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45 }, name: 'Alder' },
        tooltip: { trigger: 'axis' },
        series: [{ type: 'bar', data: aktive, name: 'Aktive' }],
      }}
    />
  );
};
