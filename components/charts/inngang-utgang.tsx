'use client';

import { format, isAfter, isBefore, subDays } from 'date-fns';
import type { ECharts } from 'echarts/core';
import { useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import { parseAsDate } from '@/app/custom-query-parsers';
import { NoData } from '@/components/no-data/no-data';
import { PRETTY_DATE_FORMAT } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import { type Behandling, isFerdigstilt } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  behandlinger: Behandling[];
}

interface Data {
  labels: string[];
  inngang: number[];
  utgang: number[];
  inngangTotal: number;
  utgangTotal: number;
}

const title = 'Inngang/utgang';

export const InngangUtgang = ({ behandlinger }: Props) => {
  const [fromFilter] = useQueryState(QueryParam.FROM, parseAsDate);
  const [toFilter] = useQueryState(QueryParam.TO, parseAsDate);
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

  const { labels, inngang, utgang, inngangTotal, utgangTotal } = useMemo<Data>(() => {
    if (fromFilter === null || toFilter === null) {
      return { labels: [], inngang: [], utgang: [], inngangTotal: 0, utgangTotal: 0 };
    }

    const buckets = createBuckets(fromFilter, toFilter);

    let innTotal = 0;
    let utTotal = 0;

    for (const b of behandlinger) {
      if (!isBefore(new Date(b.created), fromFilter)) {
        const diffFromStart = new Date(b.created).valueOf() - fromFilter.valueOf();
        const innWeek = Math.floor(diffFromStart / WEEK_IN_MS);

        buckets[innWeek].inngang += 1;
        innTotal += 1;
      }

      if (isFerdigstilt(b) && !isAfter(new Date(b.avsluttetAvSaksbehandlerDate), toFilter)) {
        const diffFromStart = new Date(b.avsluttetAvSaksbehandlerDate).valueOf() - fromFilter.valueOf();
        const utWeek = Math.floor(diffFromStart / WEEK_IN_MS);

        buckets[utWeek].utgang += 1;
        utTotal += 1;
      }
    }

    const values = Object.values(buckets);

    return {
      labels: values.map((b) => b.label),
      inngang: values.map((b) => b.inngang),
      utgang: values.map((b) => b.utgang),
      inngangTotal: innTotal,
      utgangTotal: utTotal,
    };
  }, [behandlinger, fromFilter, toFilter]);

  if (behandlinger.length === 0 || labels.length === 0 || inngang.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      getInstance={setEChartsInstance}
      option={{
        grid: { bottom: 225 },
        dataZoom: [{ type: 'slider' }],
        title: {
          text: 'Antall saker inn til Kabal / ut av Kabal per uke',
          subtext: `Antall saker inn til Kabal: ${inngangTotal}, antall saker ferdigstilt i Kabal: ${utgangTotal}`,
        },
        yAxis: { type: 'value', name: 'Antall saker' },
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45 }, name: 'Fra og med - til og med' },
        legend: { bottom: 60 },
        tooltip: { trigger: 'axis' },
        series: [
          { type: 'line', smooth: true, data: inngang, name: 'Antall saker inn til Kabal' },
          { type: 'line', smooth: true, data: utgang, name: 'Antall saker ferdigstilt i Kabal' },
        ],
      }}
    />
  );
};

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const getLabel = (date: Date) =>
  `${format(date, PRETTY_DATE_FORMAT)} - ${format(subDays(new Date(date.valueOf() + WEEK_IN_MS), 1), PRETTY_DATE_FORMAT)} `;

const createBuckets = (from: Date, to: Date) => {
  const buckets: Record<number, { inngang: number; utgang: number; label: string }> = {};

  for (let i = 0, t = from.valueOf(); t <= to.valueOf(); t += WEEK_IN_MS, i++) {
    buckets[i] = { inngang: 0, utgang: 0, label: getLabel(new Date(t)) };
  }

  return buckets;
};
