import { eachMonthOfInterval, format, parse } from 'date-fns';
import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts';
import { useMemo } from 'react';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { ISO_DATE_FORMAT, ISO_MONTH_FORMAT } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import { formatPercent } from '@/lib/format';
import { percent } from '@/lib/percent';
import { useKaUtfallFilter } from '@/lib/query-state/query-state';
import {
  type FerdigstiltSakITR,
  type IKodeverkSimpleValue,
  isSakITROmgjøringsutfall,
  isSakITRUtfall,
  type LedigSakITR,
  SAK_I_TR_IKKE_OMGJØRINGSUTFALL,
  SAK_I_TR_OMGJØRINGSUTFALL,
  SAK_I_TR_UTFALL,
  SakITRUtfall,
  type TildeltSakITR,
  Utfall,
} from '@/lib/types';

const HOS_TR = 'hos_tr';

interface Props {
  uferdige: (LedigSakITR | TildeltSakITR)[];
  ferdigstilte: FerdigstiltSakITR[];
  utfall: IKodeverkSimpleValue<Utfall | SakITRUtfall>[];
}

export const OmgjøringsprosentOverTid = ({ uferdige, ferdigstilte, utfall }: Props) => {
  const { fromFilter, toFilter } = useDateFilter();
  const [utfallFilter] = useKaUtfallFilter();

  const ferdigstilteCount = ferdigstilte.filter((f) => f.resultat !== null).length;
  const totalCaseCount = uferdige.length + ferdigstilteCount;

  const utfallMap = useMemo(() => new Map(utfall.map((u) => [u.id, u])), [utfall]);

  const { labels, perMonth, series, unfinishedData, totalOmgjortCount, totalOmgjortPercent } = useMemo(() => {
    const from = parse(fromFilter, ISO_DATE_FORMAT, new Date());
    const to = parse(toFilter, ISO_DATE_FORMAT, new Date());

    const months = eachMonthOfInterval({ start: from, end: to }).map((d) => format(d, ISO_MONTH_FORMAT));
    const perMonth = calculateCountPerMonthPerUtfall(months, uferdige, ferdigstilte);

    const values = perMonth.values().toArray();

    const totalOmgjortCount = values.reduce((sum, monthData) => sum + monthData.omgjortCount, 0);
    const totalOmgjortPercent = ferdigstilteCount === 0 ? 0 : totalOmgjortCount / ferdigstilteCount;

    // Only show selected, if any, and relevant utfall in the legend
    const filteredUtfall =
      utfallFilter.length === 0 ? SAK_I_TR_OMGJØRINGSUTFALL : utfallFilter.filter(isSakITROmgjøringsutfall);

    const series = filteredUtfall.map((utfallId) =>
      createSerie({
        id: utfallId,
        name: utfallMap.get(utfallId)?.navn ?? 'Ukjent',
        data: values.map(({ perUtfall }) => perUtfall.get(utfallId)?.percent ?? 0),
        yAxisIndex: 0,
        color: UTFALL_COLORS[utfallId],
        stack: 'omgjort',
        markLine:
          utfallId === SakITRUtfall.MEDHOLD
            ? {
                symbol: ['none', 'none'],
                animation: false,
                data: [
                  {
                    yAxis: totalOmgjortPercent,
                    name: 'Omgjøringsprosent for perioden',
                    label: {
                      show: true,
                      formatter: ({ name }) => {
                        return `${name}: ${formatPercent(totalOmgjortPercent)} (${totalOmgjortCount} saker)`;
                      },
                      color: 'var(--ax-text-neutral)',
                      position: 'insideEndTop',
                    },
                  },
                ],
              }
            : undefined,
      }),
    );

    const unfinishedData = values.map(({ unfinished, total }) => unfinished / total);

    series.push(
      createSerie({ id: HOS_TR, name: 'Hos TR', data: unfinishedData, yAxisIndex: 1, color: 'var(--ax-neutral-500)' }),
    );

    return { labels: months, series, perMonth, unfinishedData, totalOmgjortCount, totalOmgjortPercent };
  }, [ferdigstilte, fromFilter, toFilter, uferdige, ferdigstilteCount, utfallMap, utfallFilter]);

  if (labels.length === 0) {
    return <NoData title="Omgjøringsprosent over tid" />;
  }

  const description = (
    <>
      Basert på {totalCaseCount} saker sendt til TR i løpet av valgt periode. Fordelt på utfall.{' '}
      <strong>Omgjort:</strong> {formatPercent(totalOmgjortPercent)} ({totalOmgjortCount} av {ferdigstilteCount}{' '}
      ferdigstilte saker)
    </>
  );

  const max = getMax(perMonth, unfinishedData);

  return (
    <EChart
      title="Omgjøringsprosent over tid"
      description={description}
      getInstance={resetDataZoomOnDblClick}
      option={{
        grid: { bottom: 150 },
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
              formatter: ({ axisDimension, value }: Axis) => (axisDimension === 'y' ? formatPercent(value) : value),
            },
          },
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
            if (!Array.isArray(params)) {
              return '';
            }

            const monthLabel = params[0]?.axisValue;

            if (monthLabel === undefined) {
              return '';
            }

            const monthData = perMonth.get(monthLabel);

            if (monthData === undefined) {
              return '';
            }

            let result = `<strong>${monthLabel}</strong><br/><table class="w-full mt-2">`;
            result +=
              '<thead><tr><th class="text-left" colspan="2">Utfall</th><th class="text-right pl-3">Prosent</th><th class="text-right pl-3">Antall</th></tr></thead>';
            result += '<tbody>';

            result += `<tr class="border-t border-ax-border-neutral-strong font-bold"><td class="text-left py-1" colspan="2">Omgjort</td><td class="text-right pl-3">${formatPercent(monthData.omgjortPercent)}</td><td class="text-right pl-3">${monthData.omgjortCount}</td></tr>`;

            for (const param of params) {
              if (param.seriesId === HOS_TR || !isSakITRUtfall(param.seriesId)) {
                continue;
              }

              const utfallData = monthData.perUtfall.get(param.seriesId);

              if (utfallData === undefined) {
                continue;
              }

              const rawCount = utfallData.count;
              const percentage = formatPercent(param.value);

              result += `<tr><td>${param.marker}</td><td class="text-left">${param.seriesName}</td><td class="text-right pl-3">${percentage}</td><td class="text-right pl-3">${rawCount}</td></tr>`;
            }

            const ikkeOmgjortCount = monthData.finished - monthData.omgjortCount;
            const ikkeOmgjortPercentage = formatPercent(
              monthData.finished === 0 ? 0 : ikkeOmgjortCount / monthData.finished,
            );

            result += `<tr class="border-t border-ax-border-neutral-strong font-bold"><td class="text-left py-1" colspan="2">Ikke omgjort</td><td class="text-right pl-3">${ikkeOmgjortPercentage}</td><td class="text-right pl-3">${ikkeOmgjortCount}</td></tr>`;

            for (const utfallId of SAK_I_TR_IKKE_OMGJØRINGSUTFALL) {
              const utfallData = monthData.perUtfall.get(utfallId);

              if (utfallData === undefined) {
                continue;
              }

              const percentage = formatPercent(utfallData.percent);
              const rawCount = utfallData.count;

              result += `<tr><td><span style="border-color: ${UTFALL_COLORS[utfallId]};" class="inline-block mr-1 border border-dashed rounded-full w-[10px] h-[10px]" /></td><td class="text-left">${utfallMap.get(utfallId)?.navn ?? 'Ukjent'}</td><td class="text-right">${percentage}</td><td class="text-right pl-3">${rawCount}</td></tr>`;
            }

            // Add "Total" row
            result += `<tr class="border-t border-ax-border-neutral-strong font-bold"><td class="text-left py-1" colspan="2">Total</td><td class="text-right pl-3">100,0 %</td><td class="text-right pl-3">${monthData.total}</td></tr>`;

            // Add "Ferdigstilte" row
            const finishedPercent = percent(monthData.finished, monthData.total);
            result += `<tr class="border-ax-border-neutral-strong"><td><span class="inline-block mr-1 rounded-full w-[10px] h-[10px] border border-dashed border-ax-accent-500" /></td><td class="text-left">Ferdigstilte</td><td class="text-right pl-3">${finishedPercent}</td><td class="text-right pl-3">${monthData.finished}</td></tr>`;

            // Add "Hos TR" row
            const hosTRPercentage = percent(monthData.unfinished, monthData.total);
            result += `<tr class="border-ax-border-neutral-strong italic"><td><span class="inline-block mr-1 rounded-full w-[10px] h-[10px] bg-ax-neutral-500" /></td><td class="text-left py-1">Hos TR</td><td class="text-right pl-3">${hosTRPercentage}</td><td class="text-right pl-3">${monthData.unfinished}</td></tr>`;

            result += '</tbody></table>';

            result += `<div role="progressbar" aria-valuenow="${finishedPercent}" aria-valuemin="0" aria-valuemax="100" class="w-full aksel-progress-bar aksel-progress-bar--small"><div style="width: ${finishedPercent}%" class="h-full bg-ax-accent-500" /></div>`;

            return result;
          },
        },
        yAxis: [
          { type: 'value', name: 'Omgjort', axisLabel: { formatter: (v: number) => formatPercent(v, 0) }, max },
          {
            type: 'value',
            name: 'Hos TR',
            inverse: true,
            axisLabel: { formatter: (v: number) => formatPercent(v, 0) },
            max,
          },
        ],
        xAxis: { type: 'category', boundaryGap: false, data: labels, axisLabel: { rotate: 45 } },
        series,
      }}
    />
  );
};

interface UtfallData {
  count: number;
  percent: number;
}

type PerUtfall = Map<SakITRUtfall, UtfallData>;

type MonthData = {
  total: number;
  finished: number;
  unfinished: number;
  omgjortCount: number;
  omgjortPercent: number;
  perUtfall: PerUtfall;
};

const calculateCountPerMonthPerUtfall = (
  months: string[],
  uferdige: (LedigSakITR | TildeltSakITR)[],
  ferdigstilte: FerdigstiltSakITR[],
) => {
  const countPerMonthMap = new Map<string, MonthData>();

  for (const month of months) {
    const perUtfall = new Map<SakITRUtfall, UtfallData>(SAK_I_TR_UTFALL.map((u) => [u, { count: 0, percent: 0 }])); // Initiate with 0 values for all utfall.

    let unfinishedCount = 0;
    let finishedCount = 0;
    let omgjortCount = 0;

    for (const behandling of uferdige) {
      if (behandling.sendtTilTR.startsWith(month)) {
        unfinishedCount++;
      }
    }

    // Count completed cases
    for (const behandling of ferdigstilte) {
      if (behandling.resultat !== null && behandling.sendtTilTR.startsWith(month)) {
        finishedCount++;

        if (SAK_I_TR_OMGJØRINGSUTFALL.includes(behandling.resultat.utfallId)) {
          omgjortCount++;
        }

        const utfallData = perUtfall.get(behandling.resultat.utfallId);

        if (utfallData !== undefined) {
          utfallData.count += 1;
        } else {
          perUtfall.set(behandling.resultat.utfallId, { count: 1, percent: 1 });
        }
      }
    }

    // Calculate percentages
    for (const [_utfallId, data] of perUtfall) {
      data.percent = finishedCount === 0 ? 0 : data.count / finishedCount;
    }

    countPerMonthMap.set(month, {
      finished: finishedCount,
      total: finishedCount + unfinishedCount,
      unfinished: unfinishedCount,
      omgjortCount: omgjortCount,
      omgjortPercent: finishedCount === 0 ? 0 : omgjortCount / finishedCount,
      perUtfall,
    });
  }

  return countPerMonthMap;
};

const getMax = (perMonth: Map<string, MonthData>, unfinishedData: number[]) => {
  const unfinishedMax = Math.ceil(Math.max(...unfinishedData));

  if (unfinishedMax === 1) {
    return 1;
  }

  const finishedMax = Math.ceil(Math.max(...perMonth.values().map((m) => m.omgjortPercent)));

  if (finishedMax === 1) {
    return 1;
  }

  return Math.min(finishedMax + unfinishedMax, 1);
};

const UTFALL_COLORS: Record<SakITRUtfall, string> = {
  [Utfall.OPPHEVET]: 'var(--ax-meta-purple-500)',
  [Utfall.MEDHOLD]: 'var(--ax-danger-500)',
  [Utfall.DELVIS_MEDHOLD]: 'var(--ax-warning-500)',
  [Utfall.STADFESTET]: 'var(--ax-success-500)',
  [Utfall.AVVIST]: 'var(--ax-accent-500)',
  [Utfall.HEVET]: 'var(--ax-meta-lime-500)',
  [Utfall.HENVIST]: 'var(--ax-brand-blue-500)',

  [Utfall.GJENOPPTATT_DELVIS_FULLT_MEDHOLD]: 'var(--ax-meta-purple-800)',
  [Utfall.GJENOPPTATT_OPPHEVET]: 'var(--ax-danger-800)',
  [Utfall.GJENOPPTATT_STADFESTET]: 'var(--ax-warning-800)',
  [Utfall.IKKE_GJENOPPTATT]: 'var(--ax-success-800)',
};

interface SerieParams {
  id: string;
  name: string;
  color: string;
  data: number[];
  stack?: string;
  yAxisIndex?: number;
  markLine?: LineSeriesOption['markLine'];
}

const createSerie = ({
  id,
  name,
  color,
  data,
  stack,
  yAxisIndex = 0,
  markLine,
}: SerieParams): LineSeriesOption | BarSeriesOption => ({
  id,
  name,
  data,
  yAxisIndex,
  type: data.length > 1 ? 'line' : 'bar',
  stack,
  smooth: 0.3,
  symbol: 'none',
  itemStyle: { color },
  lineStyle: { width: 2 },
  areaStyle: { color, opacity: 0.6 },
  emphasis: { focus: 'series' },
  markLine,
});

interface YAxis {
  axisDimension: 'y';
  axisIndex: 1;
  value: number;
}

interface XAxis {
  axisDimension: 'x';
  axisIndex: 0;
  value: string;
}

type Axis = YAxis | XAxis;
