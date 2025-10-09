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
  pressure: number[];
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
  const { labels, inn, ut, pressure, innTotal, utTotal, diffTotal } = useMemo<Data>(() => {
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
    const pressure: number[] = [];
    let innTotal = 0;
    let utTotal = 0;

    for (const v of values) {
      labels.push(v.label);
      inn.push(v.inn);
      ut.push(v.ut);
      innTotal += v.inn;
      utTotal += v.ut;
      if (v.ut === 0 && v.inn === 0) {
        pressure.push(0);
      } else if (v.ut === 0) {
        pressure.push(1_000); // Arbitrary high value to indicate overload when no cases are completed
      } else {
        pressure.push(Math.round((v.inn / v.ut) * 100)); // Real value otherwise
      }
    }

    const diffTotal = innTotal - utTotal;
    const utAverage = Math.round(utTotal / values.length);
    const innAverage = Math.round(innTotal / values.length);

    return { labels, inn, ut, pressure: pressure, diffTotal, innTotal, utTotal, innAverage, utAverage };
  }, [ferdigstilte, fromFilter, toFilter, createBuckets, getInBucketIndex, getOutBucketIndex, uferdigeList]);

  if ((ferdigstilte.length === 0 && uferdigeList.length === 0) || labels.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={`{bold|Mottatt}: ${innTotal}. {bold|Ferdigstilt}: ${utTotal}. {bold|Endring i restanse}: ${sign(diffTotal)}${Math.abs(diffTotal)}.`}
      getInstance={resetDataZoomOnDblClick}
      option={{
        title: { subtextStyle: { rich: { bold: { fontWeight: 'bold' } } } },
        grid: { bottom: 225 },
        dataZoom: [{ type: 'slider' }],
        yAxis: [
          {
            type: 'value',
            name: 'Mottatt / ferdigstilt',
            max: getNiceMax([...inn, ...ut], 5),
            axisPointer: {
              snap: true,
            },
          },
          {
            type: 'value',
            name: 'Trykk %',
            inverse: true, // This makes the axis grow downwards
            position: 'right',
            max: 100_000,
            show: false, // Hide the axis
            axisPointer: {
              show: false, // Hide the axis pointer on this y-axis
            },
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
        legend: { bottom: 60, data: ['Mottatt', 'Ferdigstilt'] },
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

              if (seriesId === 'pressure') {
                continue;
              }

              // Add % for pressure series
              const formattedValue = seriesId === 'pressure' ? `${value} % ift. ferdigstilte` : `${value} saker`;

              result += `${marker} ${seriesName}: ${formattedValue}<br/>`;
            }

            return result;
          },
        },
        visualMap: {
          show: false,
          seriesIndex: 2, // Index of the pressure series (3rd series, 0-indexed)
          pieces: [
            {
              gte: 100,
              color: 'var(--ax-danger-500)',
            },
            {
              lt: 100,
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
            lineStyle: { type: 'solid', width: 2 },
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
            lineStyle: { type: 'solid', width: 2 },
            areaStyle: {
              color: 'var(--ax-bg-success-soft)',
            },
          },
          {
            id: 'pressure',
            type: 'bar',
            data: pressure,
            name: 'Trykk ift. ferdigstilte',
            yAxisIndex: 1,
            symbol: 'none',
            barWidth: '100%',
            barMinHeight: 2,
            label: {
              show: false,
              position: 'top',
              formatter: '{c} %',
            },
            emphasis: {
              disabled: true,
            },
          },
        ],
      }}
    />
  );
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

const getNiceMax = (data: number[], padding = 10): number => {
  const maxValue = Math.max(...data);

  // Calculate a "nice" max value for the y-axis.
  // E.g., if maxValue is 83, we want to return 90. If it is 2430, we want to return 2500.
  // But we want to add X% (padding) buffer to the max value to avoid the line touching the top of the chart.
  const buffer = Math.ceil((maxValue * padding) / 100);
  const adjustedMax = maxValue + buffer;
  const magnitude = 10 ** Math.floor(Math.log10(adjustedMax));
  const niceMax = Math.ceil(adjustedMax / magnitude) * magnitude;

  return niceMax;
};
