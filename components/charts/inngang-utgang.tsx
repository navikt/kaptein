'use client';

import { eachWeekOfInterval, getISOWeek, getISOWeekYear } from 'date-fns';
import type { ECharts } from 'echarts/core';
import { useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import { parseAsDate } from '@/app/custom-query-parsers';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  behandlinger: Behandling[];
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

  const { labels, inngang, utgang } = useMemo<{ labels: string[]; inngang: number[]; utgang: number[] }>(() => {
    if (fromFilter === null || toFilter === null) {
      return { labels: [], inngang: [], utgang: [] };
    }

    const buckets = eachWeekOfInterval({ start: fromFilter, end: toFilter }, { weekStartsOn: 1 })
      .map((d) => getLabel(d))
      .reduce<Record<string, { inngang: number; utgang: number }>>((acc, week) => {
        acc[week] = { inngang: 0, utgang: 0 };

        return acc;
      }, {});

    for (const b of behandlinger) {
      const inngangWeek = getLabel(new Date(b.created));
      buckets[inngangWeek].inngang += 1;

      if ('avsluttetAvSaksbehandlerDate' in b === false) {
        continue;
      }

      const utgangWeek = getLabel(new Date(b.avsluttetAvSaksbehandlerDate));
      buckets[utgangWeek].utgang += 1;
    }

    const values = Object.values(buckets);

    return { labels: Object.keys(buckets), inngang: values.map((b) => b.inngang), utgang: values.map((b) => b.utgang) };
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
        title: { text: title, subtext: `Viser data for ${behandlinger.length} saker` },
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
