'use client';

import { ToggleGroup } from '@navikt/ds-react';
import { differenceInMonths, endOfMonth, format, parse, startOfMonth } from 'date-fns';
import { nb } from 'date-fns/locale';
import type { LineSeriesOption } from 'echarts/charts';
import { type ReactNode, useMemo, useState } from 'react';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { ISO_DATE_FORMAT } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import { formatPercent } from '@/lib/format';
import {
  type AnkeFerdigstilt,
  type Avsluttet,
  type IKodeverkSimpleValue,
  type SakITRUtfall,
  type Utfall,
  Utfall as UtfallEnum,
} from '@/lib/types';

enum Mode {
  COUNT = 'c',
  PERCENT = 'p',
}

const MODES = Object.values(Mode);

const isMode = (value: unknown): value is Mode => MODES.some((m) => m === value);

const parseMode = (value: string): Mode | null => (isMode(value) ? value : null);

// Utfall that result in the case being sent to TR
const SENDT_TIL_TR_UTFALL: Utfall[] = [
  UtfallEnum.DELVIS_MEDHOLD,
  UtfallEnum.INNSTILLING_STADFESTET,
  UtfallEnum.INNSTILLING_AVVIST,
];

interface Props {
  ferdigstilte: AnkeFerdigstilt[];
  title: string;
  helpText?: ReactNode;
  utfall: IKodeverkSimpleValue<Utfall | SakITRUtfall>[];
}

interface MonthBucket {
  label: string;
  totalFerdigstilte: number;
  sentToTR: number;
  perUtfall: Map<Utfall, number>;
}

type MonthBuckets = Record<number, MonthBucket>;

const UTFALL_COLORS: Record<string, string> = {
  [UtfallEnum.DELVIS_MEDHOLD]: 'var(--ax-warning-500)',
  [UtfallEnum.INNSTILLING_STADFESTET]: 'var(--ax-success-500)',
  [UtfallEnum.INNSTILLING_AVVIST]: 'var(--ax-accent-500)',
};

export const SendtTilTROverTid = ({ ferdigstilte, title, helpText, utfall }: Props) => {
  const { fromFilter, toFilter } = useDateFilter();
  const [mode, setMode] = useState<Mode>(Mode.COUNT);

  const utfallMap = useMemo(() => new Map(utfall.map((u) => [u.id, u])), [utfall]);

  const { labels, bucketValues, totalPerUtfall, usedUtfall } = useMemo(() => {
    const buckets = createMonthBuckets(fromFilter, toFilter);

    // Count all anke cases and those sent to TR per month
    for (const behandling of ferdigstilte) {
      const bucketIndex = getMonthBucketIndex(behandling, fromFilter);
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
  }, [ferdigstilte, fromFilter, toFilter]);

  const totalSentToTR = Array.from(totalPerUtfall.values()).reduce((sum, count) => sum + count, 0);
  const totalAnkeFerdigstilte = ferdigstilte.length;
  const totalSentToTRPercent = totalAnkeFerdigstilte === 0 ? 0 : totalSentToTR / totalAnkeFerdigstilte;
  const avgSentToTRPerMonth = labels.length === 0 ? 0 : totalSentToTR / labels.length;

  const series = useMemo(
    () =>
      usedUtfall.map(
        (utfallId, index): LineSeriesOption => ({
          id: utfallId,
          name: utfallMap.get(utfallId)?.navn ?? 'Ukjent',
          type: 'line',
          stack: 'total',
          smooth: 0.3,
          symbol: 'none',
          data: bucketValues.map((bucket) => {
            const count = bucket.perUtfall.get(utfallId) ?? 0;

            if (mode === Mode.COUNT) {
              return count;
            }

            return bucket.totalFerdigstilte === 0 ? 0 : count / bucket.totalFerdigstilte;
          }),
          itemStyle: { color: UTFALL_COLORS[utfallId] ?? 'var(--ax-neutral-500)' },
          lineStyle: { width: 2 },
          areaStyle: { opacity: 0.6 },
          emphasis: { focus: 'series' },
          // Add markLine only to the first series
          markLine:
            index === 0
              ? {
                  symbol: ['none', 'none'],
                  animation: false,
                  lineStyle: {
                    color: 'var(--ax-danger-500)',
                  },
                  data: [
                    {
                      yAxis: mode === Mode.PERCENT ? totalSentToTRPercent : avgSentToTRPerMonth,
                      name: 'Gjennomsnitt for perioden',
                      label: {
                        show: true,
                        formatter: ({ name }: { name: string }) =>
                          mode === Mode.PERCENT
                            ? `${name}: ${formatPercent(totalSentToTRPercent, 1)} (${totalSentToTR} saker)`
                            : `${name}: ${Math.round(avgSentToTRPerMonth)} per måned (${totalSentToTR} totalt)`,
                        color: 'var(--ax-text-neutral)',
                        position: 'insideEndTop',
                      },
                    },
                  ],
                }
              : undefined,
        }),
      ),
    [bucketValues, mode, usedUtfall, utfallMap, totalSentToTRPercent, totalSentToTR, avgSentToTRPerMonth],
  );

  if (totalSentToTR === 0 || labels.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={
        <>
          <span className="font-bold">Sendt til TR:</span> {totalSentToTR} av {totalAnkeFerdigstilte} anker (
          {formatPercent(totalSentToTRPercent, 1)})
        </>
      }
      helpText={helpText}
      getInstance={resetDataZoomOnDblClick}
      headerContent={
        <ToggleGroup value={mode} onChange={(v) => setMode(parseMode(v) ?? Mode.COUNT)} size="small">
          <ToggleGroup.Item value={Mode.COUNT}>Antall</ToggleGroup.Item>
          <ToggleGroup.Item value={Mode.PERCENT}>Prosent</ToggleGroup.Item>
        </ToggleGroup>
      }
      option={{
        grid: { bottom: 225 },
        dataZoom: [{ type: 'slider' }],
        yAxis: [
          {
            type: 'value',
            name: mode === Mode.COUNT ? 'Antall' : 'Prosent',
            axisLabel: mode === Mode.PERCENT ? { formatter: (v: number) => formatPercent(v, 0) } : {},
            max: mode === Mode.PERCENT ? 1 : undefined,
            axisPointer: {
              snap: true,
              label: {
                formatter: ({ value }: { value: number }) =>
                  mode === Mode.PERCENT ? formatPercent(value, 1) : String(Math.round(value)),
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

            const monthLabel = params[0]?.axisValue;
            const dataIndex = params[0]?.dataIndex;

            if (monthLabel === undefined || dataIndex === undefined) {
              return '';
            }

            const bucket = bucketValues[dataIndex];

            if (bucket === undefined) {
              return '';
            }

            let result = `<strong>${monthLabel}</strong><br/><table class="w-full mt-2">`;
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
      totalFerdigstilte: 0,
      sentToTR: 0,
      perUtfall: new Map<Utfall, number>(),
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
