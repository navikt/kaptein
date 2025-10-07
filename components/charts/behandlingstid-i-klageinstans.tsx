'use client';

import { differenceInDays } from 'date-fns';
import { useMemo } from 'react';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { NoData } from '@/components/no-data/no-data';
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
        new Date(b.avsluttetAvSaksbehandlerDate),
        new Date(b.mottattKlageinstans),
      );

      return behandlingstid > max ? behandlingstid : max;
    }, 0);

    const buckets: Buckets = new Array(Math.ceil(max / 7)).fill(null).reduce<Buckets>((acc, _, i) => {
      acc[i] = { count: 0, label: `${i}-${i + 1} uker` };

      return acc;
    }, {});

    for (const b of ferdigstilte) {
      const index = Math.floor(
        differenceInDays(new Date(b.avsluttetAvSaksbehandlerDate), new Date(b.mottattKlageinstans)) / 7,
      );

      buckets[index].count += 1;
    }

    const values = Object.values(buckets);

    return {
      labels: values.map((b) => b.label),
      data: values.map(({ count }, index) => ({ value: count, itemStyle: { color: getColor(index) } })),
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

const getColor = (value: number) => {
  if (value <= 12) {
    return 'var(--ax-accent-500)';
  }

  if (value <= 15) {
    return 'var(--ax-warning-500)';
  }

  return 'var(--ax-danger-500)';
};
