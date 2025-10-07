'use client';

import { differenceInDays, parse } from 'date-fns';
import { useMemo } from 'react';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { NoData } from '@/components/no-data/no-data';
import { ISO_DATE_FORMAT } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, Ferdigstilt } from '@/lib/types';

type Bucket = { count: number; label: string };
type Buckets = Record<number, Bucket>;

interface Props {
  ferdigstilte: (BaseBehandling & Ferdigstilt)[];
}

const TITLE = 'Behandlingstid i klageinstans';

export const BehandlingstidIKlageinstans = ({ ferdigstilte }: Props) => {
  const { labels, data } = useMemo(() => {
    const max = ferdigstilte.reduce((max, b) => {
      const behandlingstid = differenceInDays(
        parse(b.avsluttetAvSaksbehandlerDate, ISO_DATE_FORMAT, new Date()),
        parse(b.mottattKlageinstans, ISO_DATE_FORMAT, new Date()),
      );

      return behandlingstid > max ? behandlingstid : max;
    }, 0);

    const buckets: Buckets = new Array(Math.ceil(max / 7)).fill(null).reduce<Buckets>((acc, _, i) => {
      acc[i] = { count: 0, label: `${i}-${i + 1} uker` };

      return acc;
    }, {});

    for (const b of ferdigstilte) {
      const index = Math.floor(
        differenceInDays(
          parse(b.avsluttetAvSaksbehandlerDate, ISO_DATE_FORMAT, new Date()),
          parse(b.mottattKlageinstans, ISO_DATE_FORMAT, new Date()),
        ) / 7,
      );

      const bucket = buckets[index];

      if (bucket === undefined) {
        continue;
      }

      bucket.count += 1;
    }

    const values = Object.values(buckets);

    return {
      labels: values.map((b) => b.label),
      data: values.map((b) => b.count),
    };
  }, [ferdigstilte]);

  if (ferdigstilte.length === 0 || labels.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <EChart
      title={TITLE}
      description={`Viser data for ${ferdigstilte.length} ferdigstilte saker`}
      getInstance={resetDataZoomOnDblClick}
      option={{
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
