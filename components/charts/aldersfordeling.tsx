'use client';

import { useMemo } from 'react';
import { getAvg, getMedian, NUBMER_FORMAT } from '@/components/charts/common/calculations';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { NoData } from '@/components/no-data/no-data';
import { browserLog } from '@/lib/browser-log';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, Ledig, Tildelt } from '@/lib/types';

type Bucket = { count: number; label: string };
type Buckets = Record<number, Bucket>;

interface Props {
  uferdigeList: (BaseBehandling & (Ledig | Tildelt))[];
}

interface Data {
  labels: string[];
  data: number[];
  median: number | null;
  avg: number | null;
}

const TITLE = 'Aldersfordeling';

export const Aldersfordeling = ({ uferdigeList }: Props) => {
  const { labels, data, median, avg } = useMemo<Data>(() => {
    const maxAge = uferdigeList.reduce((max, b) => (b.ageKA > max ? b.ageKA : max), 0);

    const buckets: Buckets = new Array(Math.floor(maxAge / 7) + 1).fill(null).reduce<Buckets>((acc, _, i) => {
      acc[i] = { count: 0, label: `${i}-${i + 1} uker` };

      return acc;
    }, {});

    for (const b of uferdigeList) {
      const index = Math.floor(b.ageKA / 7);

      const bucket = buckets[index];

      if (bucket === undefined) {
        browserLog.warn(`No bucket found for key ${index}. Behandling: ${JSON.stringify(b)}`);
        continue;
      }

      bucket.count += 1;
    }

    const values = Object.values(buckets);
    const ages = uferdigeList.map((b) => b.ageKA);

    return {
      labels: values.map((b) => b.label),
      data: values.map((b) => b.count),
      median: getMedian(ages),
      avg: getAvg(ages),
    };
  }, [uferdigeList]);

  if (uferdigeList.length === 0 || labels.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <EChart
      title={TITLE}
      description={`{bold|Totalt} ${uferdigeList.length} aktive saker. {bold|Gjennomsnitt}: ${getStatText(
        avg,
      )}. {bold|Median}: ${getStatText(median)}.`}
      getInstance={resetDataZoomOnDblClick}
      option={{
        title: { subtextStyle: { rich: { bold: { fontWeight: 'bold' } } } },
        grid: { bottom: 150 },
        dataZoom: [{ type: 'slider' }],
        yAxis: [{ type: 'value', name: 'Antall' }],
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45 }, name: 'Alder' },
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
