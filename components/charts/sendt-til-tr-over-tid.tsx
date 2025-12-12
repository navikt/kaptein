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
  Sakstype,
  type Utfall,
  Utfall as UtfallEnum,
} from '@/lib/types';

type Mode = 'count' | 'percent';

// Utfall that result in the case being sent to TR
const SENDT_TIL_TR_UTFALL: Utfall[] = [
  UtfallEnum.DELVIS_MEDHOLD,
  UtfallEnum.INNSTILLING_STADFESTET,
  UtfallEnum.INNSTILLING_AVVIST,
];

interface Props {
  ferdigstilte: (BaseBehandling & Avsluttet & { resultat: { utfallId: Utfall } })[];
  title: string;
  helpText?: ReactNode;
  utfall: IKodeverkSimpleValue<Utfall | SakITRUtfall>[];
}

interface WeekBucket {
  label: string;
  totalFerdigstilte: number;
  sentToTR: number;
  perUtfall: Map<Utfall, number>;
}

type WeekBuckets = Record<number, WeekBucket>;

const UTFALL_COLORS: Record<string, string> = {
  [UtfallEnum.DELVIS_MEDHOLD]: 'var(--ax-warning-500)',
  [UtfallEnum.INNSTILLING_STADFESTET]: 'var(--ax-success-700)',
  [UtfallEnum.INNSTILLING_AVVIST]: 'var(--ax-accent-700)',
};

export const SendtTilTROverTid = ({ ferdigstilte, title, helpText, utfall }: Props) => {
  const { fromFilter, toFilter } = useDateFilter();
  const [mode, setMode] = useState<Mode>('count');

  const utfallMap = useMemo(() => new Map(utfall.map((u) => [u.id, u])), [utfall]);

  // Filter to only Anke cases
  const ankeFerdigstilte = useMemo(() => ferdigstilte.filter((b) => b.typeId === Sakstype.ANKE), [ferdigstilte]);

  const { labels, bucketValues, totalPerUtfall, usedUtfall } = useMemo(() => {
    const buckets = createWeekBuckets(fromFilter, toFilter);

    // Count all Anke cases and those sent to TR per week
    for (const behandling of ankeFerdigstilte) {
      const bucketIndex = getWeekBucketIndex(behandling, fromFilter);
      const bucket = buckets[bucketIndex];

      if (bucket === undefined) {
        continue;
      }

      bucket.totalFerdigstilte += 1;

      const utfallId = behandling.resultat.utfallId;

      if (SENDT_TIL_TR_UTFALL.includes(utfallId)) {
        const currentCount = bucket.perUtfall.get(utfallId) ?? 0;
        bucket.perUtfall.set(utfallId, currentCount + 1);
        bucket.sentToTR += 1;
      }
    }

    const bucketValues = Object.values(buckets);
    const labels = bucketValues.map((b) => b.label);

    // Calculate total per utfall
    const totalPerUtfall = new Map<Utfall, number>();
    for (const bucket of bucketValues) {
      for (const [utfallId, count] of bucket.perUtfall) {
        const currentTotal = totalPerUtfall.get(utfallId) ?? 0;
        totalPerUtfall.set(utfallId, currentTotal + count);
      }
    }

    // Get list of utfall that have data
    const usedUtfall = SENDT_TIL_TR_UTFALL.filter((utfallId) => (totalPerUtfall.get(utfallId) ?? 0) > 0);

    return { labels, bucketValues, totalPerUtfall, usedUtfall };
  }, [ankeFerdigstilte, fromFilter, toFilter]);

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
            return bucket.totalFerdigstilte === 0 ? 0 : count / bucket.totalFerdigstilte;
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

  const totalSentToTR = Array.from(totalPerUtfall.values()).reduce((sum, count) => sum + count, 0);

  if (totalSentToTR === 0 || labels.length === 0) {
    return <NoData title={title} />;
  }

  const totalAnkeFerdigstilte = ankeFerdigstilte.length;
  const totalSentToTRPercent = totalAnkeFerdigstilte === 0 ? 0 : totalSentToTR / totalAnkeFerdigstilte;

  return (
    <EChart
      title={title}
      description={
        <>
          <strong>Sendt til TR:</strong> {totalSentToTR} av {totalAnkeFerdigstilte} anker (
          {formatPercent(totalSentToTRPercent, 1)})
        </>
      }
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

            let totalSent = 0;

            for (const param of params) {
              const count = bucket.perUtfall.get(param.seriesId as Utfall) ?? 0;

              if (count === 0) {
                continue;
              }

              const percent = bucket.totalFerdigstilte === 0 ? 0 : count / bucket.totalFerdigstilte;
              totalSent += count;
              result += `<tr><td>${param.marker}</td><td class="text-left">${param.seriesName}</td><td class="text-right pl-3">${count}</td><td class="text-right pl-3">${formatPercent(percent, 1)}</td></tr>`;
            }

            const totalSentPercent = bucket.totalFerdigstilte === 0 ? 0 : totalSent / bucket.totalFerdigstilte;
            result += `<tr class="border-t border-ax-border-neutral-strong font-bold"><td class="text-left py-1" colspan="2">Sendt til TR</td><td class="text-right pl-3">${totalSent}</td><td class="text-right pl-3">${formatPercent(totalSentPercent, 1)}</td></tr>`;
            result += `<tr class="text-ax-text-subtle"><td class="text-left py-1" colspan="2">Ferdigstilte anker</td><td class="text-right pl-3">${bucket.totalFerdigstilte}</td><td class="text-right pl-3">100,0 %</td></tr>`;
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
      totalFerdigstilte: 0,
      sentToTR: 0,
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
