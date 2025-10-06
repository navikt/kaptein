'use client';

import type { ECharts } from 'echarts/core';
import { useEffect, useMemo, useState } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, Ferdigstilt, Ledig, Tildelt } from '@/lib/types';

type Bucket = { aktive: number; ferdigstilte: number; label: string; total: number };
type Buckets = Record<number, Bucket>;

interface Props {
  ferdigstilte: (BaseBehandling & Ferdigstilt)[];
  uferdigeList: (BaseBehandling & (Ledig | Tildelt))[];
}

interface Data {
  labels: string[];
  ferdigstilte: number[];
  aktive: number[];
  total: number[];
}

const TITLE = 'Aldersfordeling';

export const Aldersfordeling = ({ ferdigstilte: ferdigstilteList, uferdigeList }: Props) => {
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

  const { labels, ferdigstilte, aktive, total } = useMemo<Data>(() => {
    const maxAge = [...ferdigstilteList, ...uferdigeList].reduce((max, b) => (b.ageKA > max ? b.ageKA : max), 0);

    const buckets: Buckets = new Array(Math.floor(maxAge / 7) + 1).fill(null).reduce<Buckets>((acc, _, i) => {
      acc[i] = { aktive: 0, ferdigstilte: 0, total: 0, label: `${i}-${i + 1} uker` };

      return acc;
    }, {});

    for (const b of ferdigstilteList) {
      const label = Math.floor(b.ageKA / 7);

      buckets[label].ferdigstilte += 1;
      buckets[label].total += 1;
    }

    for (const b of uferdigeList) {
      const label = Math.floor(b.ageKA / 7);

      buckets[label].aktive += 1;
      buckets[label].total += 1;
    }

    const values = Object.values(buckets);

    return {
      labels: values.map((b) => b.label),
      ferdigstilte: values.map((b) => b.ferdigstilte),
      aktive: values.map((b) => b.aktive),
      total: values.map((b) => b.total),
    };
  }, [ferdigstilteList, uferdigeList]);

  if ((ferdigstilteList.length === 0 && uferdigeList.length === 0) || labels.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <EChart
      title={TITLE}
      description={`Viser  data for ${uferdigeList.length} aktive og ${ferdigstilteList.length} ferdigstilte saker`}
      getInstance={setEChartsInstance}
      option={{
        grid: { bottom: 225 },
        dataZoom: [{ type: 'slider' }],
        yAxis: [{ type: 'value', name: 'Antall' }],
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45 }, name: 'Alder' },
        legend: { bottom: 60 },
        tooltip: { trigger: 'axis' },
        series: [
          { type: 'line', smooth: true, data: aktive, name: 'Aktive' },
          { type: 'line', smooth: true, data: ferdigstilte, name: 'Ferdigstilte' },
          { type: 'line', smooth: true, data: total, name: 'Aktive og ferdigstilte' },
        ],
      }}
    />
  );
};
