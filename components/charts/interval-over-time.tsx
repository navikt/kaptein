'use client';

import { parse } from 'date-fns';
import { useMemo } from 'react';
import { getAvg, getMedian, NUBMER_FORMAT } from '@/components/charts/common/calculations';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { browserLog } from '@/lib/browser-log';
import { ISO_DATE_FORMAT } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import { formatDecimal } from '@/lib/format';
import type { Behandling } from '@/lib/types';

type Bucket = { label: string; values: number[] };
export type Buckets = Record<number, Bucket>;

interface Props<T extends Behandling> {
  behandlinger: T[];
  getValue: (b: T) => number;
  getBucketKey: (b: T, from: Date, to: Date) => number | null;
  createBuckets: (from: Date, to: Date) => Buckets;
  title: string;
  helpText: string;
  xAxisLabel: string;
}

export const IntervalOverTime = <T extends Behandling>({
  behandlinger,
  getBucketKey,
  getValue,
  title,
  xAxisLabel,
  createBuckets,
  helpText,
}: Props<T>) => {
  const { fromFilter, toFilter } = useDateFilter();

  const { labels, avg, median, globalAvg, globalMedian } = useMemo(() => {
    const from = parse(fromFilter, ISO_DATE_FORMAT, new Date());
    const to = parse(toFilter, ISO_DATE_FORMAT, new Date());

    const buckets = createBuckets(from, to);

    for (const b of behandlinger) {
      const key = getBucketKey(b, from, to);

      if (key === null) {
        continue;
      }

      const bucket = buckets[key];

      if (bucket === undefined) {
        browserLog.warn(`No bucket found for key ${key}. Behandling: ${JSON.stringify(b)}`);
        continue;
      }

      bucket.values.push(getValue(b));
    }

    const values = Object.values(buckets);
    const allValues = values.flatMap((b) => b.values);

    return {
      labels: values.map((b) => b.label),
      avg: values.map((b) => getAvg(b.values)),
      median: values.map((b) => getMedian(b.values)),
      globalAvg: getAvg(allValues),
      globalMedian: getMedian(allValues),
    };
  }, [behandlinger, fromFilter, toFilter, getValue, getBucketKey, createBuckets]);

  if (behandlinger.length === 0 || labels.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={
        <>
          <strong>Totalt</strong> {behandlinger.length} ferdigstilte saker. <strong>Gjennomsnitt</strong>:{' '}
          {getStatText(globalAvg)}. <strong>Median</strong>: {getStatText(globalMedian)}.
        </>
      }
      helpText={helpText}
      getInstance={resetDataZoomOnDblClick}
      option={{
        grid: { bottom: 225 },
        legend: { bottom: 60 },
        dataZoom: [{ type: 'slider' }],
        yAxis: [{ type: 'value', name: 'Dager' }],
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45 }, name: xAxisLabel },
        tooltip: { trigger: 'axis', valueFormatter: (p: number) => NUBMER_FORMAT.format(p) },
        series: [
          {
            type: 'line',
            smooth: true,
            data: avg,
            name: 'Gjennomsnitt',
            color: 'var(--ax-brand-blue-500)',
            markLine: {
              silent: true,
              symbol: 'none',
              data: [
                {
                  yAxis: globalAvg,
                  label: {
                    show: true,
                    formatter: `Snitt: ${formatDecimal((globalAvg ?? 0) / 7)} uker / ${Math.round(globalAvg ?? 0)} dager`,
                    color: 'var(--ax-text-neutral)',
                    position: 'insideEndTop',
                  },
                },
              ],
            },
          },
          {
            type: 'line',
            smooth: true,
            data: median,
            name: 'Median',
            color: 'var(--ax-success-500)',
            markLine: {
              silent: true,
              symbol: 'none',
              data: [
                {
                  yAxis: globalMedian,
                  label: {
                    show: true,
                    formatter: `Median: ${formatDecimal((globalMedian ?? 0) / 7)} uker / ${Math.round(globalMedian ?? 0)} dager`,
                    color: 'var(--ax-text-neutral)',
                    position: 'insideEndBottom',
                  },
                },
              ],
            },
          },
        ],
      }}
    />
  );
};

const getStatText = (stat: number | null) => {
  if (stat === null) {
    return '-';
  }

  return `${formatDecimal(stat / 7)} uker / ${Math.round(stat)} dager`;
};
