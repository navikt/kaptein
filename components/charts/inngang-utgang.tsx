'use client';

import { eachWeekOfInterval, getWeek, getYear, isSameYear, max, min } from 'date-fns';
import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { FerdigstiltBehandling } from '@/lib/server/types';

interface Props {
  behandlinger: FerdigstiltBehandling[];
}

const title = 'Inngang/utgang';

export const InngangUtgang = ({ behandlinger }: Props) => {
  const { labels, inngang, utgang } = useMemo<{ labels: string[]; inngang: number[]; utgang: number[] }>(() => {
    const sortedByInngang = behandlinger.toSorted((a, b) => a.created.localeCompare(b.created));
    const sortedByUtgang = behandlinger.toSorted((a, b) =>
      a.avsluttetAvSaksbehandlerDate.localeCompare(b.avsluttetAvSaksbehandlerDate),
    );

    const firstInngang = sortedByInngang.at(0)?.created;
    const lastInngang = sortedByInngang.at(-1)?.created;
    const firstUtgang = sortedByUtgang.at(0)?.avsluttetAvSaksbehandlerDate;
    const lastUtgang = sortedByUtgang.at(-1)?.avsluttetAvSaksbehandlerDate;

    if (
      firstInngang === undefined ||
      firstUtgang === undefined ||
      lastInngang === undefined ||
      lastUtgang === undefined
    ) {
      return { labels: [], inngang: [], utgang: [] };
    }

    const start = min([new Date(firstInngang), new Date(firstUtgang)]);
    const end = max([new Date(lastInngang), new Date(lastUtgang)]);

    const sameYear = isSameYear(start, end);

    const buckets = eachWeekOfInterval({ start, end })
      .map((d) => getLabel(d, sameYear))
      .reduce<Record<string, { inngang: number; utgang: number }>>((acc, week) => {
        acc[week] = { inngang: 0, utgang: 0 };

        return acc;
      }, {});

    for (const b of sortedByInngang) {
      const inngangWeek = getLabel(new Date(b.created), sameYear);
      const utgangWeek = getLabel(new Date(b.avsluttetAvSaksbehandlerDate), sameYear);

      buckets[inngangWeek].inngang += 1;
      buckets[utgangWeek].utgang += 1;
    }

    const values = Object.values(buckets);

    return { labels: Object.keys(buckets), inngang: values.map((b) => b.inngang), utgang: values.map((b) => b.utgang) };
  }, [behandlinger]);

  if (behandlinger.length === 0 || labels.length === 0 || inngang.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      option={{
        title: { text: title, subtext: `Viser data for ${behandlinger.length} saker` },
        yAxis: { type: 'value' },
        xAxis: { type: 'category', data: labels, axisLabel: { rotate: 45 } },
        legend: {},
        series: [
          { type: 'line', smooth: true, data: inngang, name: 'Inngang' },
          { type: 'line', smooth: true, data: utgang, name: 'Utgang' },
        ],
      }}
    />
  );
};

const getLabel = (date: Date, sameYear: boolean) =>
  sameYear ? `${getWeek(date)}` : `${getYear(date)}/${getWeek(date)}`;
