'use client';

import { differenceInMonths, endOfMonth, format, parse, startOfMonth } from 'date-fns';
import { nb } from 'date-fns/locale';
import { type ReactNode, useMemo } from 'react';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { ISO_DATE_FORMAT } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import type { Avsluttet, BaseBehandling, Utfall } from '@/lib/types';

interface Props {
  ferdigstilte: (BaseBehandling & Avsluttet & { resultat: { utfallId: Utfall } })[];
  title: string;
  description?: string;
  helpText?: ReactNode;
}

interface MonthBucket {
  label: string;
  total: number;
}

type MonthBuckets = Record<number, MonthBucket>;

export const FerdigstilteOverTid = ({ ferdigstilte, title, description, helpText }: Props) => {
  const { fromFilter, toFilter } = useDateFilter();

  const { labels, bucketValues } = useMemo(() => {
    const buckets = createMonthBuckets(fromFilter, toFilter);

    // Count cases per month
    for (const behandling of ferdigstilte) {
      const bucketIndex = getMonthBucketIndex(behandling, fromFilter);
      const bucket = buckets[bucketIndex];

      if (bucket === undefined) {
        continue;
      }

      bucket.total += 1;
    }

    const bucketValues = Object.values(buckets);
    const labels = bucketValues.map((b) => b.label);

    return { labels, bucketValues };
  }, [ferdigstilte, fromFilter, toFilter]);

  const avgPerMonth = labels.length === 0 ? 0 : ferdigstilte.length / labels.length;

  if (ferdigstilte.length === 0 || labels.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      helpText={helpText}
      getInstance={resetDataZoomOnDblClick}
      option={{
        grid: { bottom: 100 },
        dataZoom: [{ type: 'slider' }],
        yAxis: [
          {
            type: 'value',
            name: 'Antall',
            axisLabel: {},
            axisPointer: {
              snap: true,
              label: {
                formatter: ({ value }: { value: number }) => String(Math.round(value)),
              },
            },
          },
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: labels,
          axisLabel: { rotate: 45 },
          name: 'Måned',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: (
            params: {
              dataIndex: number;
              axisValue: string;
              marker: string;
              seriesName: string;
              value: number;
            }[],
          ) => {
            if (!Array.isArray(params) || params.length === 0) {
              return '';
            }

            const monthLabel = params[0]?.axisValue;
            const param = params[0];

            if (monthLabel === undefined || param === undefined) {
              return '';
            }

            return `<strong>${monthLabel}</strong><br/>${param.marker} ${param.seriesName}: <strong>${param.value}</strong>`;
          },
        },
        series: [
          {
            name: 'Ferdigstilte',
            type: 'line',
            smooth: 0.3,
            symbol: 'none',
            data: bucketValues.map((bucket) => bucket.total),
            itemStyle: { color: 'var(--ax-success-500)' },
            lineStyle: { width: 2 },
            areaStyle: { opacity: 0.6 },
            markLine: {
              symbol: ['none', 'none'],
              animation: false,
              lineStyle: {
                color: 'var(--ax-danger-500)',
              },
              data: [
                {
                  yAxis: avgPerMonth,
                  name: 'Gjennomsnitt for perioden',
                  label: {
                    show: true,
                    formatter: ({ name }: { name: string }) => {
                      return `${name}: ${Math.round(avgPerMonth)} per måned (${ferdigstilte.length} totalt)`;
                    },
                    color: 'var(--ax-text-neutral)',
                    position: 'insideEndTop',
                  },
                },
              ],
            },
          },
        ],
      }}
    />
  );
};

const createMonthBuckets = (from: string, to: string): MonthBuckets => {
  const buckets: MonthBuckets = {};

  const fromDate = parse(from, ISO_DATE_FORMAT, new Date());
  const toDate = parse(to, ISO_DATE_FORMAT, new Date());

  let currentDate = startOfMonth(fromDate);
  let monthIndex = 0;

  const endDate = endOfMonth(toDate);

  while (currentDate <= endDate) {
    buckets[monthIndex] = {
      label: getMonthLabel(currentDate),
      total: 0,
    };
    monthIndex += 1;

    // Move to next month
    currentDate = startOfMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }

  return buckets;
};

const getMonthLabel = (date: Date): string => format(date, 'MMM yy', { locale: nb });

const getMonthBucketIndex = (b: Avsluttet, from: string): number => {
  const behandlingDate = parse(b.avsluttetAvSaksbehandlerDate, ISO_DATE_FORMAT, new Date());
  const fromDate = parse(from, ISO_DATE_FORMAT, new Date());

  return differenceInMonths(startOfMonth(behandlingDate), startOfMonth(fromDate));
};
