'use client';

import { isAfter, isBefore } from 'date-fns';
import type { ECharts } from 'echarts/core';
import { useEffect, useMemo, useState } from 'react';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, Ferdigstilt, Ledig, Tildelt } from '@/lib/types';

export type Bucket = { inn: number; ut: number; uferdige: number; label: string };
export type Buckets = Record<number, Bucket>;

interface Props {
  ferdigstilte: (BaseBehandling & Ferdigstilt)[];
  uferdigeList: (BaseBehandling & (Ledig | Tildelt))[];
  getInBucketIndex: (b: BaseBehandling, from: Date) => number;
  getOutBucketIndex: (b: Ferdigstilt, from: Date) => number;
  createBuckets: (from: Date, to: Date) => Buckets;
  title: string;
}

interface Data {
  labels: string[];
  inn: number[];
  ut: number[];
  uferdige: number[];
  innTotal: number;
  utTotal: number;
}

export const AntallSakerInnTilKabalFerdigstiltIKabal = ({
  ferdigstilte,
  uferdigeList,
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

  const { labels, inn, ut, uferdige, innTotal, utTotal } = useMemo<Data>(() => {
    if (fromFilter === null || toFilter === null) {
      return { labels: [], inn: [], ut: [], uferdige: [], innTotal: 0, utTotal: 0 };
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

    let uferdigeTotal = 0;

    for (const b of uferdigeList) {
      const bucketIndex = getInBucketIndex(b, fromFilter);
      buckets[bucketIndex].inn += 1;
      uferdigeTotal += 1;
      buckets[bucketIndex].uferdige = uferdigeTotal;
    }

    innTotal += uferdigeTotal;

    const values = Object.values(buckets);

    return {
      labels: values.map((b) => b.label),
      inn: values.map((b) => b.inn),
      ut: values.map((b) => b.ut),
      uferdige: values.map((b) => b.uferdige),
      innTotal: innTotal,
      utTotal: utTotal,
    };
  }, [ferdigstilte, fromFilter, toFilter, createBuckets, getInBucketIndex, getOutBucketIndex, uferdigeList]);

  const uferdigeTrend = useMemo(() => {
    if (uferdige.length === 0) {
      return [];
    }

    // Calculate linear regression for trend line
    const n = uferdige.length;
    const sumX = uferdige.reduce((sum, _, i) => sum + i, 0);
    const sumY = uferdige.reduce((sum, val) => sum + val, 0);
    const sumXY = uferdige.reduce((sum, val, i) => sum + i * val, 0);
    const sumX2 = uferdige.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return uferdige.map((_, i) => Math.round(slope * i + intercept));
  }, [uferdige]);

  if ((ferdigstilte.length === 0 && uferdigeList.length === 0) || labels.length === 0) {
    return <NoData title={title} />;
  }

  const maxInnUt = Math.max(...inn, ...ut);
  const maxUferdig = Math.max(...uferdige);

  return (
    <EChart
      title={title}
      description={`Antall saker inn til Kabal: ${innTotal}, antall saker ferdigstilt i Kabal: ${utTotal}`}
      getInstance={setEChartsInstance}
      option={{
        grid: { bottom: 225 },
        dataZoom: [{ type: 'slider' }],
        yAxis: [
          { type: 'value', name: 'Inn / ferdigstilt', min: 0, max: Math.round(maxInnUt * 1.1) },
          { type: 'value', name: 'Uferdige', min: 0, max: Math.round(maxUferdig * 1.1) },
        ],
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45 }, name: 'Fra og med - til og med' },
        legend: { bottom: 60 },
        tooltip: { trigger: 'axis' },
        series: [
          {
            type: 'line',
            smooth: true,
            data: inn,
            name: 'Antall saker inn til Kabal',
            yAxisIndex: 0,
            color: '#5470c6',
            lineStyle: { type: 'solid', width: 1 },
            symbol: 'none',
          },
          {
            type: 'line',
            smooth: true,
            data: ut,
            name: 'Antall saker ferdigstilt i Kabal',
            yAxisIndex: 0,
            color: '#91cc75',
            lineStyle: { type: 'solid', width: 1 },
            symbol: 'none',
          },
          {
            type: 'line',
            smooth: true,
            data: uferdige,
            name: 'Antall saker uferdige i Kabal',
            yAxisIndex: 1,
            color: '#fac858',
            lineStyle: { type: 'solid', width: 1 },
            symbol: 'none',
          },
          {
            type: 'line',
            smooth: false,
            data: uferdigeTrend,
            name: 'Trend uferdige saker',
            yAxisIndex: 1,
            color: '#ee6666',
            lineStyle: { type: 'dashed', width: 2 },
            symbol: 'none',
          },
        ],
      }}
    />
  );
};
