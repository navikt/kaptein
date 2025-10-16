'use client';

import { useMemo } from 'react';
import { getAvg, getMedian, NUBMER_FORMAT } from '@/components/charts/common/calculations';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { NoData } from '@/components/no-data/no-data';
import { browserLog } from '@/lib/browser-log';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling } from '@/lib/types';

type Bucket = { count: number; label: string };
type Buckets = Record<number, Bucket>;

interface Props<T extends BaseBehandling> {
  title: string;
  behandlinger: T[];
  getDays?: (b: T) => number;
}

interface Data {
  labels: string[];
  data: number[];
  median: number | null;
  avg: number | null;
}

export const Tidsfordeling = <T extends BaseBehandling>({
  title,
  behandlinger,
  getDays = (b) => b.ageKA,
}: Props<T>) => {
  const { labels, data, median, avg } = useMemo<Data>(() => {
    const maxDays = behandlinger.reduce((max, b) => Math.max(getDays(b), max), 0);

    const buckets: Buckets = new Array(Math.floor(maxDays / 7) + 1).fill(null).reduce<Buckets>((acc, _, i) => {
      acc[i] = { count: 0, label: `${i}-${i + 1} uker` };

      return acc;
    }, {});

    for (const b of behandlinger) {
      const index = Math.floor(getDays(b) / 7);

      const bucket = buckets[index];

      if (bucket === undefined) {
        browserLog.warn(`No bucket found for key ${index}. Behandling: ${JSON.stringify(b)}`);
        continue;
      }

      bucket.count += 1;
    }

    const values = Object.values(buckets);
    const days = behandlinger.map((b) => getDays(b));

    return {
      labels: values.map((b) => b.label),
      data: values.map((b) => b.count),
      median: getMedian(days),
      avg: getAvg(days),
    };
  }, [behandlinger, getDays]);

  if (behandlinger.length === 0 || labels.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={`{bold|Totalt} ${behandlinger.length} aktive saker. {bold|Gjennomsnitt}: ${getStatText(
        avg,
      )}. {bold|Median}: ${getStatText(median)}.`}
      getInstance={resetDataZoomOnDblClick}
      option={{
        grid: { bottom: 150 },
        dataZoom: [{ type: 'slider' }],
        yAxis: [{ type: 'value', name: 'Antall' }],
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45 } },
        tooltip: { trigger: 'axis' },
        series: [{ type: 'bar', data: data, name: 'Aktive' }],
      }}
    />
  );
};

const getStatText = (stat: number | null) => {
  if (stat === null) {
    return '-';
  }

  return `${NUBMER_FORMAT.format(stat / 7)} uker / ${NUBMER_FORMAT.format(stat)} dager`;
};
