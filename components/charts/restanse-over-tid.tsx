'use client';

import { eachDayOfInterval, format, parse } from 'date-fns';
import { useMemo } from 'react';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { getRestanseAfterDate } from '@/components/charts/common/use-data';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { ISO_DATE_FORMAT } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, Ferdigstilt, IKodeverkSimpleValue, Ledig, Tildelt } from '@/lib/types';

interface Props {
  title: string;
  ferdigstilte: (BaseBehandling & Ferdigstilt)[];
  uferdige: (BaseBehandling & (Ledig | Tildelt))[];
  ytelser: IKodeverkSimpleValue[];
}

export const RestanseOverTid = ({ title, ferdigstilte, uferdige, ytelser }: Props) => {
  const { fromFilter, toFilter } = useDateFilter();

  const { labels, ytelseSeriesData } = useMemo(() => {
    const from = parse(fromFilter, ISO_DATE_FORMAT, new Date());
    const to = parse(toFilter, ISO_DATE_FORMAT, new Date());

    const ytelseMap = new Map(ytelser.map((ytelse) => [ytelse.id, ytelse]));

    const days = eachDayOfInterval({ start: from, end: to }).map((d) => format(d, ISO_DATE_FORMAT));

    const restansePerDayPerYtelse = calculateRestansePerDayPerYtelse(days, uferdige, ferdigstilte, ytelser);

    const ytelseSeriesData = calculateYtelseTimeSeries(ytelseMap, restansePerDayPerYtelse);

    return {
      labels: days,
      ytelseSeriesData,
    };
  }, [ferdigstilte, uferdige, fromFilter, toFilter, ytelser]);

  const totalRestanse = useMemo(() => {
    if (ytelseSeriesData.length === 0) {
      return 0;
    }
    // Sum up the latest restanse value for each ytelse
    return ytelseSeriesData.reduce((sum, { restanseOverTime }) => sum + (restanseOverTime.at(-1) ?? 0), 0);
  }, [ytelseSeriesData]);

  if (labels.length === 0 || ytelseSeriesData.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={`{bold|Restanse ved periodeslutt}: ${totalRestanse}`}
      getInstance={resetDataZoomOnDblClick}
      option={{
        title: { subtextStyle: { rich: { bold: { fontWeight: 'bold' } } } },
        grid: { bottom: 225 },
        dataZoom: [{ type: 'slider' }],
        legend: {
          bottom: 60,
          type: 'scroll',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            snap: true,
            label: {
              precision: '0', // Prevent showing decimals in axis tooltip
            },
          },
        },
        yAxis: {
          type: 'value',
          name: 'Antall saker',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: labels,
          axisLabel: { rotate: 45 },
        },
        series: ytelseSeriesData.map(({ ytelseNavn, restanseOverTime }) => ({
          name: ytelseNavn,
          type: 'line',
          smooth: false,
          stack: 'total',
          symbol: 'none',
          data: restanseOverTime,
          lineStyle: {
            width: 0,
          },
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
        })),
      }}
    />
  );
};

const calculateRestansePerDayPerYtelse = (
  days: string[],
  uferdige: (BaseBehandling & (Ledig | Tildelt))[],
  ferdigstilte: (BaseBehandling & Ferdigstilt)[],
  ytelser: IKodeverkSimpleValue[],
) => {
  const restanseMap = new Map<string, Map<string, number>>();

  for (const day of days) {
    const dayBucket = new Map<string, number>();

    // Ensure all days have an entry for all ytelser, even if 0
    for (const ytelse of ytelser) {
      dayBucket.set(ytelse.id, 0);
    }

    // Get all cases that were uncompleted or completed after this day
    const restanseAfterDay = getRestanseAfterDate(uferdige, ferdigstilte, day);

    // Count restanse per ytelse
    for (const sak of restanseAfterDay) {
      const diff = dayBucket.get(sak.ytelseId) ?? 0;
      dayBucket.set(sak.ytelseId, diff + 1);
    }

    restanseMap.set(day, dayBucket);
  }

  return restanseMap;
};

interface YtelseTimeSeries {
  ytelseId: string;
  ytelseNavn: string;
  restanseOverTime: number[];
}

const calculateYtelseTimeSeries = (
  ytelseMap: Map<string, IKodeverkSimpleValue>,
  restansePerDayPerYtelse: Map<string, Map<string, number>>,
): YtelseTimeSeries[] => {
  const ytelseData = new Map<string, YtelseTimeSeries>();

  // Transpose the map to be per ytelse instead of per day
  // restansePerDayPerYtelse is sorted by day due to how it was constructed
  for (const ytelser of restansePerDayPerYtelse.values()) {
    for (const [ytelseId, restanse] of ytelser) {
      const data = ytelseData.get(ytelseId);

      if (data === undefined) {
        const ytelseNavn = ytelseMap.get(ytelseId)?.navn ?? 'Ukjent';
        ytelseData.set(ytelseId, { ytelseId, ytelseNavn, restanseOverTime: [restanse] });
      } else {
        data.restanseOverTime.push(restanse);
      }
    }
  }

  return ytelseData
    .values()
    .filter((r) => r.restanseOverTime.some((v) => v > 0))
    .toArray()
    .toSorted((a, b) => a.ytelseNavn.localeCompare(b.ytelseNavn, 'nb'));
};
