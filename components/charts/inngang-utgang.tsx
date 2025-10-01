'use client';

import { eachWeekOfInterval, getISOWeek, getISOWeekYear, isAfter, isBefore } from 'date-fns';
import type { ECharts } from 'echarts/core';
import { useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import { parseAsDate } from '@/app/custom-query-parsers';
import { NoData } from '@/components/no-data/no-data';
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

    const buckets = eachWeekOfInterval({ start: fromFilter, end: toFilter }, { weekStartsOn: 1 })
      .map((d) => getLabel(d))
      .reduce<Record<string, { inngang: number; utgang: number }>>((acc, week) => {
        acc[week] = { inngang: 0, utgang: 0 };

        return acc;
      }, {});

    let inngangTotal = 0;
    let utgangTotal = 0;

    for (const b of behandlinger) {
      if (!isBefore(new Date(b.created), fromFilter)) {
        const inngangWeek = getLabel(new Date(b.created));
        buckets[inngangWeek].inngang += 1;
        inngangTotal += 1;
      }

      if (isFerdigstilt(b) && !isAfter(new Date(b.avsluttetAvSaksbehandlerDate), toFilter)) {
        const utgangWeek = getLabel(new Date(b.avsluttetAvSaksbehandlerDate));
        buckets[utgangWeek].utgang += 1;
        utgangTotal += 1;
      }
    }

    const values = Object.values(buckets);

    return {
      labels: Object.keys(buckets),
      inngang: values.map((b) => b.inngang),
      utgang: values.map((b) => b.utgang),
      inngangTotal,
      utgangTotal,
    };
  }, [behandlinger, fromFilter, toFilter]);

  if (behandlinger.length === 0 || labels.length === 0 || inngang.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      getInstance={setEChartsInstance}
      option={{
        grid: { bottom: 140 },
        dataZoom: [{ type: 'slider' }],
        title: {
          text: title,
          subtext: `Antall saker inn til Kabal: ${inngangTotal}, Antall saker ferdigstilt i Kabal: ${utgangTotal}`,
        },
        yAxis: { type: 'value', name: 'Antall saker' },
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45 }, name: 'Ukenr.' },
        legend: { bottom: 60 },
        tooltip: { trigger: 'axis' },
        series: [
          { type: 'line', smooth: true, data: inngang, name: 'Inngang' },
          { type: 'line', smooth: true, data: utgang, name: 'Utgang' },
        ],
      }}
    />
  );
};

const getLabel = (date: Date) => `${getISOWeekYear(date)}/${getISOWeek(date)}`;
