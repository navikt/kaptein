'use client';

import { useMemo } from 'react';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, Ferdigstilt, Ledig, Tildelt } from '@/lib/types';

export type Bucket = { inn: number; ut: number; label: string };
export type Buckets = Record<number, Bucket>;

interface Props {
  ferdigstilte: (BaseBehandling & Ferdigstilt)[];
  uferdigeList: (BaseBehandling & (Ledig | Tildelt))[];
  getInBucketIndex: (b: BaseBehandling, from: string) => number;
  getOutBucketIndex: (b: Ferdigstilt, from: string) => number;
  createBuckets: (from: string, to: string) => Buckets;
  title: string;
}

interface Data {
  labels: string[];
  inn: number[];
  ut: number[];
  diff: number[];
  innTotal: number;
  utTotal: number;
  diffTotal: number;
  innAverage: number;
  utAverage: number;
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

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
  const { labels, inn, ut, diff, innTotal, utTotal, diffTotal } = useMemo<Data>(() => {
    if (fromFilter === null || toFilter === null) {
      return {
        labels: [],
        inn: [],
        ut: [],
        diff: [],
        innTotal: 0,
        utTotal: 0,
        diffTotal: 0,
        innAverage: 0,
        utAverage: 0,
      };
    }

    const buckets = createBuckets(fromFilter, toFilter);

    for (const b of ferdigstilte) {
      if (b.mottattKlageinstans >= fromFilter && b.mottattKlageinstans <= toFilter) {
        const bucket = buckets[getInBucketIndex(b, fromFilter)];

        if (bucket === undefined) {
          continue;
        }

        bucket.inn += 1;
      }

      if (b.avsluttetAvSaksbehandlerDate >= fromFilter && b.avsluttetAvSaksbehandlerDate <= toFilter) {
        const bucket = buckets[getOutBucketIndex(b, fromFilter)];

        if (bucket === undefined) {
          continue;
        }

        bucket.ut += 1;
      }
    }

    for (const b of uferdigeList) {
      const bucket = buckets[getInBucketIndex(b, fromFilter)];

      if (bucket === undefined) {
        continue;
      }

      bucket.inn += 1;
    }

    const values = Object.values(buckets);

    const labels: string[] = [];
    const inn: number[] = [];
    const ut: number[] = [];
    const diff: number[] = [];
    let innTotal = 0;
    let utTotal = 0;

    for (const v of values) {
      labels.push(v.label);
      inn.push(v.inn);
      ut.push(v.ut);
      innTotal += v.inn;
      utTotal += v.ut;
      diff.push(v.inn - v.ut);
    }

    const diffTotal = innTotal - utTotal;
    const utAverage = Math.round(utTotal / values.length);
    const innAverage = Math.round(innTotal / values.length);

    return { labels, inn, ut, diff, diffTotal, innTotal, utTotal, innAverage, utAverage };
  }, [ferdigstilte, fromFilter, toFilter, createBuckets, getInBucketIndex, getOutBucketIndex, uferdigeList]);

  if ((ferdigstilte.length === 0 && uferdigeList.length === 0) || labels.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={`Mottatt: ${innTotal}, ferdigstilt: ${utTotal}, restanse endring: ${sign(diffTotal)}${Math.abs(diffTotal)}`}
      getInstance={resetDataZoomOnDblClick}
      option={{
        grid: { bottom: 225 },
        dataZoom: [{ type: 'slider' }],
        yAxis: {
          type: 'value',
          name: 'Mottatt / ferdigstilt',
          axisPointer: {
            snap: true,
          },
        },
        xAxis: {
          type: 'category',
          data: labels,
          axisLabel: { rotate: 45 },
          name: 'Fra og med - til og med',
        },
        legend: { bottom: 60, selected: { 'Restanse endring': false, 'Restanse trend': false } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
        series: [
          {
            type: 'line',
            smooth: true,
            data: inn,
            name: 'Mottatt',
            color: 'var(--ax-accent-500)',
            lineStyle: { type: 'solid', width: 1 },
            areaStyle: {
              color: 'var(--ax-bg-accent-softA)',
            },
          },
          {
            type: 'line',
            smooth: true,
            data: ut,
            name: 'Ferdigstilt',
            color: 'var(--ax-success-500)',
            lineStyle: { type: 'solid', width: 1 },
            stack: 'total',
            areaStyle: {
              color: 'var(--ax-bg-success-soft)',
            },
          },
          {
            type: 'line',
            smooth: true,
            data: diff,
            name: 'Restanse endring',
            color: 'var(--ax-meta-purple-500)',
            lineStyle: { type: 'solid', width: 1 },
          },
          {
            type: 'line',
            smooth: false,
            data: getTrend(diff),
            name: 'Restanse trend',
            color: 'var(--ax-meta-purple-500)',
            lineStyle: { type: 'dashed', width: 1 },
            symbol: 'none',
          },
        ],
      }}
    />
  );
};

const getTrend = (data: number[]): number[] => {
  if (data.length === 0) {
    return [];
  }

  // Calculate linear regression for trend line
  const n = data.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    const value = data[i];

    if (value === undefined) {
      continue;
    }

    sumX += i;
    sumY += value;
    sumXY += i * value;
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map((_, i) => Math.round(slope * i + intercept));
};

const sign = (n: number): string => {
  if (n > 0) {
    return '+';
  }

  if (n < 0) {
    return '-';
  }

  return '';
};
