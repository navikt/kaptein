'use client';

import { format, fromUnixTime, min, parse, subDays } from 'date-fns';
import { useMemo } from 'react';
import { getAvg, getMedian, NUBMER_FORMAT } from '@/components/charts/common/calculations';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { browserLog } from '@/lib/browser-log';
import { ISO_DATE_FORMAT, PRETTY_DATE_FORMAT } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling } from '@/lib/types';

type Bucket = { label: string; values: number[] };
type Buckets = Record<number, Bucket>;

interface Props<T extends Behandling> {
  behandlinger: T[];
  getValue: (b: T) => number;
  getBucketKey: (b: T, from: Date, to: Date) => number | null;
  title: string;
  xAxisLabel: string;
  description: string;
}

export const IntervalOverTime = <T extends Behandling>({
  behandlinger,
  getBucketKey,
  getValue,
  title,
  xAxisLabel,
  description,
}: Props<T>) => {
  const { fromFilter, toFilter } = useDateFilter();

  const { labels, avg, median } = useMemo(() => {
    if (fromFilter === null || toFilter === null) {
      return { labels: [], avg: [], median: [] };
    }

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

    return {
      labels: values.map((b) => b.label),
      avg: values.map((b) => getAvg(b.values)),
      median: values.map((b) => getMedian(b.values)),
    };
  }, [behandlinger, fromFilter, toFilter, getValue, getBucketKey]);

  if (behandlinger.length === 0 || labels.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      getInstance={resetDataZoomOnDblClick}
      option={{
        grid: { bottom: 225 },
        legend: { bottom: 60 },
        dataZoom: [{ type: 'slider' }],
        yAxis: [{ type: 'value', name: 'Dager' }],
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45 }, name: xAxisLabel },
        tooltip: { trigger: 'axis', valueFormatter: (p: number) => NUBMER_FORMAT.format(p) },
        series: [
          { type: 'line', smooth: true, data: avg, name: 'Gjennomsnitt' },
          { type: 'line', smooth: true, data: median, name: 'Median' },
        ],
      }}
    />
  );
};

const createBuckets = (from: Date, to: Date) => {
  const buckets: Buckets = {};

  for (let i = 0, t = from.getTime(); t <= to.getTime(); t += MS_IN_A_WEEK, i++) {
    buckets[i] = { label: getWeekLabel(fromUnixTime(t / 1000), to), values: [] };
  }

  return buckets;
};

const getWeekLabel = (date: Date, maxDate: Date) => {
  const from = format(date, PRETTY_DATE_FORMAT);
  const weekEnd = subDays(date.getTime() + MS_IN_A_WEEK, 1);
  const to = format(min([weekEnd, maxDate]), PRETTY_DATE_FORMAT);

  return `${from} - ${to}`;
};

const SECONDS_IN_A_WEEK = 7 * 24 * 60 * 60;
const MS_IN_A_WEEK = SECONDS_IN_A_WEEK * 1000;
