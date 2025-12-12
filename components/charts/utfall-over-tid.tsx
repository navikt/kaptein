'use client';

import { ToggleGroup } from '@navikt/ds-react';
import { addDays, differenceInWeeks, endOfDay, format, min, parse, startOfDay } from 'date-fns';
import type { LineSeriesOption } from 'echarts/charts';
import { type ReactNode, useMemo, useState } from 'react';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { ISO_DATE_FORMAT, ISO_DATE_TIME_FORMAT, PRETTY_DATE_FORMAT } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import { formatPercent } from '@/lib/format';
import {
  type Avsluttet,
  type BaseBehandling,
  type IKodeverkSimpleValue,
  type SakITRUtfall,
  UTFALL,
  Utfall,
} from '@/lib/types';

type Mode = 'count' | 'percent';

interface Props {
  ferdigstilte: (BaseBehandling & Avsluttet & { resultat: { utfallId: Utfall } })[];
  title: string;
  helpText?: ReactNode;
  utfall: IKodeverkSimpleValue<Utfall | SakITRUtfall>[];
}

interface WeekBucket {
  label: string;
  total: number;
  perUtfall: Map<Utfall, number>;
}

type WeekBuckets = Record<number, WeekBucket>;

const UTFALL_COLORS: Record<Utfall, string> = {
  [Utfall.TRUKKET]: 'var(--ax-neutral-500)',
  [Utfall.RETUR]: 'var(--ax-brand-blue-500)',
  [Utfall.OPPHEVET]: 'var(--ax-meta-purple-500)',
  [Utfall.MEDHOLD]: 'var(--ax-danger-500)',
  [Utfall.DELVIS_MEDHOLD]: 'var(--ax-warning-500)',
  [Utfall.STADFESTET]: 'var(--ax-success-500)',
  [Utfall.UGUNST]: 'var(--ax-danger-800)',
  [Utfall.AVVIST]: 'var(--ax-accent-500)',
  [Utfall.INNSTILLING_STADFESTET]: 'var(--ax-success-700)',
  [Utfall.INNSTILLING_AVVIST]: 'var(--ax-accent-700)',
  [Utfall.HEVET]: 'var(--ax-meta-lime-500)',
  [Utfall.HENVIST]: 'var(--ax-brand-blue-700)',
  [Utfall.MEDHOLD_FORVALTNINGSLOVEN_35]: 'var(--ax-danger-300)',
  [Utfall.BESLUTNING_IKKE_OMGJOERE]: 'var(--ax-neutral-700)',
  [Utfall.STADFESTET_ANNEN_BEGRENNELSE]: 'var(--ax-success-300)',
  [Utfall.HENLAGT]: 'var(--ax-neutral-300)',
  [Utfall.INNSTILLING_GJENOPPTAS_VEDTAK_STADFESTES]: 'var(--ax-success-800)',
  [Utfall.INNSTILLING_GJENOPPTAS_IKKE]: 'var(--ax-neutral-600)',
  [Utfall.GJENOPPTATT_DELVIS_FULLT_MEDHOLD]: 'var(--ax-meta-purple-700)',
  [Utfall.GJENOPPTATT_OPPHEVET]: 'var(--ax-meta-purple-300)',
  [Utfall.GJENOPPTATT_STADFESTET]: 'var(--ax-success-400)',
  [Utfall.IKKE_GJENOPPTATT]: 'var(--ax-neutral-400)',
};

export const UtfallOverTid = ({ ferdigstilte, title, helpText, utfall }: Props) => {
  const { fromFilter, toFilter } = useDateFilter();
  const [mode, setMode] = useState<Mode>('count');

  const utfallMap = useMemo(() => new Map(utfall.map((u) => [u.id, u])), [utfall]);

  const { labels, bucketValues, totalPerUtfall, usedUtfall } = useMemo(() => {
    const buckets = createWeekBuckets(fromFilter, toFilter);

    // Count utfall per week
    for (const behandling of ferdigstilte) {
      const bucketIndex = getWeekBucketIndex(behandling, fromFilter);
      const bucket = buckets[bucketIndex];

      if (bucket === undefined) {
        continue;
      }

      const utfallId = behandling.resultat.utfallId;
      const currentCount = bucket.perUtfall.get(utfallId) ?? 0;
      bucket.perUtfall.set(utfallId, currentCount + 1);
      bucket.total += 1;
    }

    const bucketValues = Object.values(buckets);
    const labels = bucketValues.map((b) => b.label);

    // Calculate total per utfall and find which utfall are actually used
    const totalPerUtfall = new Map<Utfall, number>();
    for (const bucket of bucketValues) {
      for (const [utfallId, count] of bucket.perUtfall) {
        const currentTotal = totalPerUtfall.get(utfallId) ?? 0;
        totalPerUtfall.set(utfallId, currentTotal + count);
      }
    }

    // Get list of utfall that have data
    const usedUtfall = UTFALL.filter((utfallId) => (totalPerUtfall.get(utfallId) ?? 0) > 0);

    return { labels, bucketValues, totalPerUtfall, usedUtfall };
  }, [ferdigstilte, fromFilter, toFilter]);

  const series = useMemo(() => {
    return usedUtfall.map(
      (utfallId): LineSeriesOption => ({
        id: utfallId,
        name: utfallMap.get(utfallId)?.navn ?? 'Ukjent',
        type: 'line',
        stack: 'total',
        smooth: 0.3,
        symbol: 'none',
        data: bucketValues.map((bucket) => {
          const count = bucket.perUtfall.get(utfallId) ?? 0;
          if (mode === 'percent') {
            return bucket.total === 0 ? 0 : count / bucket.total;
          }
          return count;
        }),
        itemStyle: { color: UTFALL_COLORS[utfallId] ?? 'var(--ax-neutral-500)' },
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.6 },
        emphasis: { focus: 'series' },
      }),
    );
  }, [bucketValues, mode, usedUtfall, utfallMap]);

  if (ferdigstilte.length === 0 || labels.length === 0) {
    return <NoData title={title} />;
  }

  const utfallCount = totalPerUtfall.size;

  return (
    <EChart
      title={title}
      description={`${ferdigstilte.length} ferdigstilte saker fordelt på ${utfallCount} utfall`}
      helpText={helpText}
      getInstance={resetDataZoomOnDblClick}
      headerContent={
        <ToggleGroup value={mode} onChange={(v) => setMode(v as Mode)} size="small">
          <ToggleGroup.Item value="count">Antall</ToggleGroup.Item>
          <ToggleGroup.Item value="percent">Prosent</ToggleGroup.Item>
        </ToggleGroup>
      }
      option={{
        grid: { bottom: 225 },
        dataZoom: [{ type: 'slider' }],
        yAxis: [
          {
            type: 'value',
            name: mode === 'count' ? 'Antall' : 'Prosent',
            axisLabel: mode === 'percent' ? { formatter: (v: number) => formatPercent(v, 0) } : undefined,
            max: mode === 'percent' ? 1 : undefined,
            axisPointer: {
              snap: true,
              label: {
                formatter: ({ value }: { value: number }) =>
                  mode === 'percent' ? formatPercent(value, 1) : String(Math.round(value)),
              },
            },
          },
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: labels,
          axisLabel: { rotate: 45 },
          name: 'Uke',
        },
        legend: {
          bottom: 60,
          type: 'scroll',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: (
            params: {
              seriesId: string;
              dataIndex: number;
              data: number;
              value: number;
              axisValue: string;
              marker: string;
              seriesName: string;
            }[],
          ) => {
            if (!Array.isArray(params) || params.length === 0) {
              return '';
            }

            const weekLabel = params[0]?.axisValue;
            const dataIndex = params[0]?.dataIndex;

            if (weekLabel === undefined || dataIndex === undefined) {
              return '';
            }

            const bucket = bucketValues[dataIndex];

            if (bucket === undefined) {
              return '';
            }

            let result = `<strong>${weekLabel}</strong><br/><table class="w-full mt-2">`;
            result +=
              '<thead><tr><th class="text-left" colspan="2">Utfall</th><th class="text-right pl-3">Antall</th><th class="text-right pl-3">Prosent</th></tr></thead>';
            result += '<tbody>';

            let total = 0;

            for (const param of params) {
              const count = bucket.perUtfall.get(param.seriesId as Utfall) ?? 0;

              if (count === 0) {
                continue;
              }

              const percent = bucket.total === 0 ? 0 : count / bucket.total;
              total += count;
              result += `<tr><td>${param.marker}</td><td class="text-left">${param.seriesName}</td><td class="text-right pl-3">${count}</td><td class="text-right pl-3">${formatPercent(percent, 1)}</td></tr>`;
            }

            const totalPercent = bucket.total === 0 ? 0 : total / bucket.total;
            result += `<tr class="border-t border-ax-border-neutral-strong font-bold"><td class="text-left py-1" colspan="2">Totalt</td><td class="text-right pl-3">${total}</td><td class="text-right pl-3">${formatPercent(totalPercent, 1)}</td></tr>`;
            result += '</tbody></table>';

            return result;
          },
        },
        series,
      }}
    />
  );
};

const createWeekBuckets = (from: string, to: string): WeekBuckets => {
  const buckets: WeekBuckets = {};

  let currentDateTime = format(startOfDay(from), ISO_DATE_TIME_FORMAT);
  let weekNumber = 0;

  const endDateTime = format(endOfDay(to), ISO_DATE_TIME_FORMAT);

  while (currentDateTime <= endDateTime) {
    const endOfWeek = format(min([addDays(currentDateTime, 6), endDateTime]), ISO_DATE_TIME_FORMAT);

    buckets[weekNumber] = {
      label: getWeekLabel(currentDateTime, endOfWeek),
      total: 0,
      perUtfall: new Map<Utfall, number>(),
    };
    weekNumber += 1;

    const firstDayInNextWeek = format(addDays(endOfWeek, 1), ISO_DATE_TIME_FORMAT);
    currentDateTime = firstDayInNextWeek;
  }

  return buckets;
};

const getWeekLabel = (start: string, end: string) => {
  const from = format(start, PRETTY_DATE_FORMAT);
  const to = format(end, PRETTY_DATE_FORMAT);

  return `${from} - ${to}`;
};

const getWeekBucketIndex = (b: Avsluttet, from: string): number =>
  differenceInWeeks(
    parse(b.avsluttetAvSaksbehandlerDate, ISO_DATE_FORMAT, new Date()),
    parse(from, ISO_DATE_FORMAT, new Date()),
  );
