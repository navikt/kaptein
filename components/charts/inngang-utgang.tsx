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
  ratio: number[];
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
  const { labels, inn, ut, diff, ratio, innTotal, utTotal, diffTotal } = useMemo<Data>(() => {
    if (fromFilter === null || toFilter === null) {
      return {
        labels: [],
        inn: [],
        ut: [],
        diff: [],
        ratio: [],
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
    const ratio: number[] = [];
    let innTotal = 0;
    let utTotal = 0;

    for (const v of values) {
      labels.push(v.label);
      inn.push(v.inn);
      ut.push(v.ut);
      innTotal += v.inn;
      utTotal += v.ut;
      diff.push(v.ut - v.inn);
      if (v.ut === 0 && v.inn === 0) {
        ratio.push(0);
      } else if (v.ut === 0) {
        ratio.push(200); // Arbitrary high value to indicate overload when no cases are completed
      } else {
        ratio.push(Math.round((v.inn / v.ut) * 100)); // Real value otherwise
      }
    }

    const diffTotal = innTotal - utTotal;
    const utAverage = Math.round(utTotal / values.length);
    const innAverage = Math.round(innTotal / values.length);

    return { labels, inn, ut, diff, ratio, diffTotal, innTotal, utTotal, innAverage, utAverage };
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
        yAxis: [
          {
            type: 'value',
            name: 'Mottatt / ferdigstilt',
            max: getNiceMax([...inn, ...ut]),
            axisPointer: {
              snap: true,
            },
          },
          {
            type: 'value',
            name: 'Ferdigstilt %',
            inverse: true, // This makes the axis grow downwards
            position: 'right',
            max: Math.max(...ratio) * 10,
            show: false, // Hide the axis
            axisLabel: {
              formatter: '{value} %',
            },
          },
        ],
        xAxis: {
          type: 'category',
          data: labels,
          axisLabel: { rotate: 45 },
          name: 'Fra og med - til og med',
        },
        legend: { bottom: 60, selected: { Flyt: false, 'Flyt trend': false } },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: (params: unknown) => {
            if (!Array.isArray(params) || params.length === 0) {
              return '';
            }

            const axisValue = params[0].axisValue;
            let result = `<strong>${axisValue}</strong><br/>`;

            for (const param of params) {
              const { seriesId, marker, seriesName, value } = param;

              // Add % for pressure series
              const formattedValue = seriesId === 'pressure' ? `${value} % av mottatte` : `${value} saker`;

              result += `${marker} ${seriesName}: ${formattedValue}<br/>`;
            }

            return result;
          },
        },
        visualMap: {
          show: false,
          seriesIndex: 4, // Index of the Ratio series (5th series, 0-indexed)
          pieces: [
            {
              gte: 100,
              color: 'var(--ax-danger-500)',
            },
            {
              gte: 90,
              lt: 100,
              color: 'var(--ax-warning-500)',
            },
            {
              lt: 90,
              color: 'var(--ax-success-500)',
            },
          ],
        },
        series: [
          {
            id: 'in',
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
            id: 'out',
            type: 'line',
            smooth: true,
            data: ut,
            name: 'Ferdigstilt',
            color: 'var(--ax-success-500)',
            lineStyle: { type: 'solid', width: 1 },
            areaStyle: {
              color: 'var(--ax-bg-success-soft)',
            },
          },
          {
            id: 'flow',
            type: 'line',
            smooth: true,
            data: diff,
            name: 'Flyt',
            color: 'var(--ax-meta-purple-500)',
            lineStyle: { type: 'solid', width: 1 },
            areaStyle: {
              color: 'var(--ax-bg-meta-purple-soft)',
            },
          },
          {
            id: 'flow-trend',
            type: 'line',
            smooth: false,
            data: getTrend(diff),
            name: 'Flyt trend',
            color: 'var(--ax-meta-purple-500)',
            lineStyle: { type: 'dashed', width: 1 },
            symbol: 'none',
          },
          {
            id: 'pressure',
            type: 'bar',
            data: ratio,
            name: 'Ferdigstilt %',
            yAxisIndex: 1,
            symbol: 'none',
            barMaxWidth: 20,
            label: {
              show: false,
              position: 'top',
              formatter: '{c} %',
            },
            emphasis: {
              disabled: true,
            },
            markLine: {
              silent: true,
              symbol: 'none',
              z: -1,
              lineStyle: {
                color: 'var(--ax-text-neutral-decoration)',
                type: 'dashed',
                width: 1,
              },
              label: {
                show: false,
                position: 'end',
                formatter: '100%',
              },
              data: [
                {
                  yAxis: 100,
                },
              ],
            },
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

const getNiceMax = (data: number[]): number => {
  const maxValue = Math.max(...data);

  // Calculate a "nice" max value for the y-axis.
  // E.g., if maxValue is 83, we want to return 90. If it is 2430, we want to return 2500.
  // But we want to add 10% buffer to the max value to avoid the line touching the top of the chart.
  const buffer = Math.ceil(maxValue * 0.1);
  const adjustedMax = maxValue + buffer;
  const magnitude = 10 ** Math.floor(Math.log10(adjustedMax));
  const niceMax = Math.ceil(adjustedMax / magnitude) * magnitude;

  return niceMax;
};
