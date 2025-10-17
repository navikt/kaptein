import { eachMonthOfInterval, format, parse } from 'date-fns';
import { useMemo } from 'react';
import { resetDataZoomOnDblClick } from '@/components/charts/common/reset-data-zoom';
import { useDateFilter } from '@/components/charts/common/use-date-filter';
import { NoData } from '@/components/no-data/no-data';
import { ISO_DATE_FORMAT, ISO_MONTH_FORMAT } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import {
  ANKE_I_TR_OMGJØRINGSUTFALL,
  AnkeITRUtfall,
  type BaseAnkeITR,
  type IKodeverkSimpleValue,
  type Resultat,
  Utfall,
} from '@/lib/types';

const HOS_TR = 'hos_tr';
type HosTR = typeof HOS_TR;

interface Result {
  resultat: Resultat<AnkeITRUtfall> | null;
}

interface Props {
  behandlinger: (BaseAnkeITR & Result)[];
  utfall: IKodeverkSimpleValue<Utfall | AnkeITRUtfall>[];
}

export const OmgjøringsprosentOverTid = ({ behandlinger, utfall }: Props) => {
  const { fromFilter, toFilter } = useDateFilter();

  const { labels, utfallSeriesData, total, totalPerMonthCountMap, totalOmgjort, totalOmgjortPercent } = useMemo(() => {
    const from = parse(fromFilter, ISO_DATE_FORMAT, new Date());
    const to = parse(toFilter, ISO_DATE_FORMAT, new Date());

    const utfallMap = new Map(utfall.map((u) => [u.id, u]));
    const months = eachMonthOfInterval({ start: from, end: to }).map((d) => format(d, ISO_MONTH_FORMAT));

    // Calculate cumulative count per day per omgjort utfall
    const { percentPerMonthMap, countPerMonthMap, totalPerMonthCountMap } = calculateCountPerMonthPerUtfall(
      months,
      behandlinger,
    );
    const utfallSeriesData = calculateUtfallTimeSeries(utfallMap, percentPerMonthMap, countPerMonthMap);

    const totalOmgjort = behandlinger.filter(
      (b) => b.resultat !== null && ANKE_I_TR_OMGJØRINGSUTFALL.includes(b.resultat.utfallId),
    ).length;

    return {
      labels: months,
      utfallSeriesData,
      total: behandlinger.length,
      totalPerMonthCountMap,
      totalOmgjort,
      totalOmgjortPercent: ((totalOmgjort / behandlinger.length) * 100).toFixed(1),
    };
  }, [behandlinger, utfall, fromFilter, toFilter]);

  if (labels.length === 0 || utfallSeriesData.length === 0) {
    return <NoData title="Omgjøringsprosent over tid" />;
  }

  const description = `Basert på ${total} saker sendt til TR ila. valgt periode. Fordelt på utfall. {bold|Omgjort}: ${totalOmgjortPercent} % (${totalOmgjort})`;

  const max = Math.min(Math.round(Math.max(...utfallSeriesData.map((u) => Math.max(...u.percentOverTime))) * 2), 100);

  return (
    <EChart
      title="Omgjøringsprosent over tid"
      description={description}
      getInstance={resetDataZoomOnDblClick}
      className="rounded-full"
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
              precision: '1',
            },
          },
          formatter: (params: unknown) => {
            if (!Array.isArray(params)) {
              return '';
            }
            const monthLabel = params[0]?.axisValue ?? '';
            let result = `<strong>${monthLabel}</strong><br/><table class="w-full mt-2">`;
            result +=
              '<thead><tr><th class="text-left">Utfall</th><th class="text-right pl-3">Prosent</th><th class="text-right pl-3">Antall</th></tr></thead>';
            result += '<tbody>';

            let omgjortPercentage = 0;
            let omgjortCount = 0;

            for (const param of params) {
              const seriesData = utfallSeriesData.find((s) => s.utfallId === param.seriesId);

              if (seriesData === undefined) {
                continue;
              }

              const rawCount = seriesData.countOverTime[param.dataIndex] ?? 0;
              const percentage = param.value.toFixed(1);
              result += `<tr><td class="text-left">${param.marker} ${param.seriesName}</td><td class="text-right pl-3">${percentage} %</td><td class="text-right pl-3">${rawCount}</td></tr>`;

              // Sum up omgjort values (excluding "Hos TR")
              if (seriesData.utfallId !== HOS_TR) {
                omgjortPercentage += typeof percentage === 'number' ? percentage : Number.parseFloat(percentage);
                omgjortCount += rawCount;
              }
            }

            const totalInMonth = totalPerMonthCountMap.get(monthLabel) ?? 0;
            const ikkeOmgjortCount = totalInMonth - omgjortCount;
            const ikkeOmgjortPercentage = totalInMonth === 0 ? 0 : ((ikkeOmgjortCount / totalInMonth) * 100).toFixed(1);

            result += `<tr class="border-t border-ax-border-neutral-strong"><td class="text-left py-1">Omgjort</td><td class="text-right pl-3 pt-1">${omgjortPercentage.toFixed(1)} %</td><td class="text-right pl-3 pt-1">${omgjortCount}</td></tr>`;
            result += `<tr class="border-t border-ax-border-neutral-strong"><td class="text-left py-1">Ikke omgjort</td><td class="text-right pl-3 pt-1">${ikkeOmgjortPercentage} %</td><td class="text-right pl-3 pt-1">${ikkeOmgjortCount}</td></tr>`;

            // Add "Totalt" row
            result += `<tr class="border-t border-ax-border-neutral-strong"><td class="text-left pt-1 font-semibold" colspan="2">Totalt</td><td class="text-right pl-3 pt-1 font-semibold">${totalInMonth}</td></tr>`;

            result += '</tbody></table>';
            return result;
          },
        },
        yAxis: [
          {
            type: 'value',
            name: 'Omgjort',
            axisLabel: {
              formatter: '{value} %',
            },
            max,
          },
          {
            type: 'value',
            name: 'Hos TR',
            inverse: true,
            axisLabel: {
              formatter: '{value} %',
            },
            max,
          },
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: labels,
          axisLabel: { rotate: 45 },
        },
        series: utfallSeriesData.map(({ utfallId, utfallNavn, percentOverTime: countOverTime }) => ({
          id: utfallId,
          name: utfallNavn,
          type: 'line',
          smooth: 0.3,
          stack: utfallId === HOS_TR ? undefined : 'total',
          stackOrder: 'seriesDesc',
          symbol: 'none',
          data: countOverTime,
          yAxisIndex: utfallId === HOS_TR ? 1 : 0,
          itemStyle: {
            color: utfallId === HOS_TR ? 'var(--ax-neutral-500)' : UTFALL_COLORS[utfallId],
          },
          lineStyle: {
            width: 2,
          },
          areaStyle: {
            color: utfallId === HOS_TR ? 'var(--ax-neutral-500)' : UTFALL_COLORS[utfallId],
            opacity: 0.6,
          },
          emphasis: {
            focus: 'series',
          },
        })),
      }}
    />
  );
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
const calculateCountPerMonthPerUtfall = (months: string[], behandlinger: (BaseAnkeITR & Result)[]) => {
  const percentPerMonthMap = new Map<string, Map<AnkeITRUtfall | HosTR, number>>();
  const countPerMonthMap = new Map<string, Map<AnkeITRUtfall | HosTR, number>>();
  const totalPerMonthCountMap = new Map<string, number>();

  for (const month of months) {
    const monthBucket = new Map<AnkeITRUtfall | HosTR, number>([[HOS_TR, 0]]);
    const rawMonthBucket = new Map<AnkeITRUtfall | HosTR, number>([[HOS_TR, 0]]);
    let monthCount = 0;

    // Ensure all days have an entry for all omgjort utfall, even if 0
    for (const u of ANKE_I_TR_OMGJØRINGSUTFALL) {
      monthBucket.set(u, 0);
      rawMonthBucket.set(u, 0);
    }

    // Count total cases completed on or before this day
    let totalCasesUntilDay = 0;

    // Count cases completed on or before this day
    for (const behandling of behandlinger) {
      if (behandling.sendtTilTR.startsWith(month)) {
        monthCount++;
        totalCasesUntilDay++;

        if (behandling.resultat === null) {
          const count = monthBucket.get(HOS_TR) ?? 0;
          monthBucket.set(HOS_TR, count + 1);
          rawMonthBucket.set(HOS_TR, count + 1);
        } else {
          const utfallId = behandling.resultat.utfallId;

          // Only count omgjort utfall
          if (ANKE_I_TR_OMGJØRINGSUTFALL.includes(utfallId)) {
            const count = monthBucket.get(utfallId) ?? 0;
            monthBucket.set(utfallId, count + 1);
            rawMonthBucket.set(utfallId, count + 1);
          }
        }
      }
    }

    totalPerMonthCountMap.set(month, monthCount);

    // Store raw counts
    countPerMonthMap.set(month, rawMonthBucket);

    // Convert counts to percentages
    if (totalCasesUntilDay > 0) {
      for (const [utfallId, count] of monthBucket) {
        monthBucket.set(utfallId, (count / totalCasesUntilDay) * 100);
      }
    } else {
      for (const [utfallId] of monthBucket) {
        monthBucket.set(utfallId, 0);
      }
    }

    percentPerMonthMap.set(month, monthBucket);
  }

  return { percentPerMonthMap, countPerMonthMap, totalPerMonthCountMap };
};

interface UtfallTimeSeries {
  utfallId: AnkeITRUtfall | HosTR;
  utfallNavn: string;
  percentOverTime: number[];
  countOverTime: number[];
}

const calculateUtfallTimeSeries = (
  utfallMap: Map<string, IKodeverkSimpleValue>,
  percentPerMonthPerUtfall: Map<string, Map<AnkeITRUtfall | HosTR, number>>,
  countsPerMonthPerUtfall: Map<string, Map<AnkeITRUtfall | HosTR, number>>,
): UtfallTimeSeries[] => {
  const utfallSeries = new Map<AnkeITRUtfall | HosTR, UtfallTimeSeries>();

  // Transpose the map to be per utfall instead of per day
  const months = Array.from(percentPerMonthPerUtfall.keys());

  for (const month of months) {
    const percentPerUtfall = percentPerMonthPerUtfall.get(month);
    const countPerUtfall = countsPerMonthPerUtfall.get(month);

    if (percentPerUtfall === undefined || countPerUtfall === undefined) {
      continue;
    }

    for (const [utfallId, percent] of percentPerUtfall) {
      const count = countPerUtfall.get(utfallId) ?? 0;
      const series = utfallSeries.get(utfallId);

      if (series === undefined) {
        const utfallNavn = utfallId === HOS_TR ? 'Hos TR' : (utfallMap.get(utfallId)?.navn ?? 'Ukjent');
        utfallSeries.set(utfallId, { utfallId, utfallNavn, percentOverTime: [percent], countOverTime: [count] });
      } else {
        series.percentOverTime.push(percent);
        series.countOverTime.push(count);
      }
    }
  }

  return [
    utfallSeries.get(AnkeITRUtfall.MEDHOLD),
    utfallSeries.get(AnkeITRUtfall.DELVIS_MEDHOLD),
    utfallSeries.get(AnkeITRUtfall.OPPHEVET),
    utfallSeries.get(HOS_TR),
  ].filter((d): d is UtfallTimeSeries => d !== undefined);
};

const UTFALL_COLORS: Record<AnkeITRUtfall, string> = {
  [Utfall.OPPHEVET]: 'var(--ax-meta-purple-500)',
  [Utfall.MEDHOLD]: 'var(--ax-danger-500)',
  [Utfall.DELVIS_MEDHOLD]: 'var(--ax-warning-500)',
  [Utfall.STADFESTET]: 'var(--ax-success-500)',
  [Utfall.AVVIST]: 'var(--ax-accent-500)',
  [Utfall.HEVET]: 'var(--ax-meta-lime-500)',
  [Utfall.HENVIST]: 'var(--ax-meta-purple-500)',
};
