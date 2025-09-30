'use client';

import { isAfter, isBefore } from 'date-fns';
import type { ECharts } from 'echarts/core';
import { useEffect, useMemo, useState } from 'react';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, Ferdigstilt, Ledig, Tildelt } from '@/lib/types';

export type Bucket = { inn: number; ut: number; label: string };
export type Buckets = Record<number, Bucket>;

interface Props {
  ferdigstilte: (BaseBehandling & Ferdigstilt)[];
  uferdige: (BaseBehandling & (Ledig | Tildelt))[];
  getInBucketIndex: (b: BaseBehandling, from: Date) => number;
  getOutBucketIndex: (b: Ferdigstilt, from: Date) => number;
  createBuckets: (from: Date, to: Date) => Buckets;
  title: string;
}

interface Data {
  labels: string[];
  inn: number[];
  ut: number[];
  innTotal: number;
  utTotal: number;
}

export const AntallSakerInnTilKabalFerdigstiltIKabal = ({
  ferdigstilte,
  uferdige,
  title,
  createBuckets,
  getInBucketIndex,
  getOutBucketIndex,
}: Props) => {
  const { fromFilter, toFilter } = useDateFilter();
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

  const { labels, inn, ut, innTotal, utTotal } = useMemo<Data>(() => {
    if (fromFilter === null || toFilter === null) {
      return { labels: [], inn: [], ut: [], innTotal: 0, utTotal: 0 };
    }

    const buckets = createBuckets(fromFilter, toFilter);

    let innTotal = 0;
    let utTotal = 0;

    for (const b of ferdigstilte) {
      if (!isBefore(new Date(b.created), fromFilter) && !isAfter(new Date(b.created), toFilter)) {
        buckets[getInBucketIndex(b, fromFilter)].inn += 1;
        innTotal += 1;
      }

      if (
        !isBefore(new Date(b.avsluttetAvSaksbehandlerDate), fromFilter) &&
        !isAfter(new Date(b.avsluttetAvSaksbehandlerDate), toFilter)
      ) {
        buckets[getOutBucketIndex(b, fromFilter)].ut += 1;
        utTotal += 1;
      }
    }

    for (const b of uferdige) {
      buckets[getInBucketIndex(b, fromFilter)].inn += 1;
      innTotal += 1;
    }

    const values = Object.values(buckets);

    return {
      labels: values.map((b) => b.label),
      inn: values.map((b) => b.inn),
      ut: values.map((b) => b.ut),
      innTotal: innTotal,
      utTotal: utTotal,
    };
  }, [ferdigstilte, fromFilter, toFilter, uferdige, createBuckets, getInBucketIndex, getOutBucketIndex]);

  if ((ferdigstilte.length === 0 && uferdige.length === 0) || labels.length === 0 || inn.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      getInstance={setEChartsInstance}
      option={{
        grid: { bottom: 225 },
        dataZoom: [{ type: 'slider' }],
        title: {
          text: title,
          subtext: `Antall saker inn til Kabal: ${innTotal}, antall saker ferdigstilt i Kabal: ${utTotal}`,
        },
        yAxis: { type: 'value', name: 'Antall saker' },
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45 }, name: 'Fra og med - til og med' },
        legend: { bottom: 60 },
        tooltip: { trigger: 'axis' },
        series: [
          { type: 'line', smooth: true, data: inn, name: 'Antall saker inn til Kabal' },
          { type: 'line', smooth: true, data: ut, name: 'Antall saker ferdigstilt i Kabal' },
        ],
      }}
    />
  );
};
