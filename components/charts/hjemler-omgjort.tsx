'use client';

import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import {
  ANKE_I_TR_OMGJØRINGSUTFALL,
  type AnkeITRFerdigstilt,
  type IKodeverkSimpleValue,
  type IYtelse,
  type RegistreringshjemlerMap,
} from '@/lib/types';

interface Props {
  title: string;
  description: string;
  /**
   * Maximum number of hjemler to show in the chart. Set to -1 to show all.
   */
  maxHjemler: number;
  behandlinger: AnkeITRFerdigstilt[];
  klageenheter: IKodeverkSimpleValue[];
  ytelser: IYtelse[];
  registreringshjemlerMap: RegistreringshjemlerMap;
}

interface HjemmelBranch {
  id: string;
  omgjort: number;
  ikkeOmgjort: number;
}

interface YtelseBranch {
  id: string;
  children: Map<string, HjemmelBranch>;
}

const getYtelserToHjemler = (behandlinger: AnkeITRFerdigstilt[]) => {
  const branches = new Map<string, YtelseBranch>();

  for (const behandling of behandlinger) {
    const { resultat, ytelseId } = behandling;

    if (resultat === null) {
      continue;
    }

    const { utfallId, registreringshjemmelIdList } = resultat;
    const isOmgjort = ANKE_I_TR_OMGJØRINGSUTFALL.includes(utfallId);

    const ytelse = branches.get(ytelseId) ?? { id: ytelseId, children: new Map() };
    branches.set(ytelseId, ytelse);

    for (const hjemmelId of registreringshjemmelIdList) {
      const hjemmel: HjemmelBranch = ytelse.children.get(hjemmelId) ?? {
        id: hjemmelId,
        omgjort: 0,
        ikkeOmgjort: 0,
      };

      if (isOmgjort) {
        hjemmel.omgjort += 1;
      } else {
        hjemmel.ikkeOmgjort += 1;
      }

      ytelse.children.set(hjemmelId, hjemmel);
    }
  }

  return branches;
};

const getAllHjemmelIds = (branches: Map<string, YtelseBranch>) => {
  const allHjemmelIds = new Set<string>();
  for (const ytelse of branches.values()) {
    for (const hjemmelId of ytelse.children.keys()) {
      allHjemmelIds.add(hjemmelId);
    }
  }
  return allHjemmelIds;
};

const collectHjemmelData = (
  allHjemmelIds: Set<string>,
  branches: Map<string, YtelseBranch>,
  registreringshjemlerMap: RegistreringshjemlerMap,
) => {
  const hjemmelData: Array<{
    id: string;
    name: string;
    percentages: number[];
    counts: number[];
    total: number;
    avgPercentage: number;
  }> = [];

  for (const hjemmelId of allHjemmelIds) {
    let totalCount = 0;
    let totalCases = 0;
    const percentages: number[] = [];
    const counts: number[] = [];

    for (const ytelse of branches.values()) {
      const hjemmel = ytelse.children.get(hjemmelId);
      const omgjortCount = hjemmel?.omgjort ?? 0;
      const ikkeOmgjortCount = hjemmel?.ikkeOmgjort ?? 0;
      const totalForHjemmelYtelse = omgjortCount + ikkeOmgjortCount;

      const percentage = totalForHjemmelYtelse > 0 ? (omgjortCount / totalForHjemmelYtelse) * 100 : 0;

      percentages.push(percentage);
      counts.push(omgjortCount);
      totalCount += omgjortCount;
      totalCases += totalForHjemmelYtelse;
    }

    if (totalCount === 0) {
      continue;
    }

    // Calculate weighted average percentage
    const avgPercentage = totalCases > 0 ? (totalCount / totalCases) * 100 : 0;

    hjemmelData.push({
      id: hjemmelId,
      name: registreringshjemlerMap[hjemmelId]?.hjemmelnavn ?? hjemmelId,
      percentages,
      counts,
      total: totalCount,
      avgPercentage,
    });
  }

  return hjemmelData;
};

const populateSeries = (
  dataToShow: Array<{ percentages: number[]; counts: number[]; name: string }>,
  branches: Map<string, YtelseBranch>,
  seriesMap: Map<string, number[]>,
  countsMap: Map<string, number[]>,
) => {
  const hjemmelNames: string[] = [];

  for (const hjemmel of dataToShow) {
    hjemmelNames.push(hjemmel.name);
    let index = 0;
    for (const ytelse of branches.values()) {
      const values = seriesMap.get(ytelse.id);
      const percentageValues = countsMap.get(ytelse.id);
      const count = hjemmel.counts[index];
      const percentage = hjemmel.percentages[index];
      if (values !== undefined && count !== undefined) {
        values.push(count);
      }
      if (percentageValues !== undefined && percentage !== undefined) {
        percentageValues.push(percentage);
      }
      index++;
    }
  }

  return hjemmelNames;
};

export const HjemlerOmgjort = ({
  title,
  description,
  maxHjemler,
  ytelser,
  registreringshjemlerMap,
  behandlinger,
}: Props) => {
  const ytelserMap = useMemo(() => {
    const map = new Map<string, IKodeverkSimpleValue>();
    for (const ytelse of ytelser) {
      map.set(ytelse.id, ytelse);
    }
    return map;
  }, [ytelser]);

  // «medhold», «delvis medhold» og «opphevet»
  const data = useMemo(() => {
    const ytelserToHjemler = getYtelserToHjemler(behandlinger);
    const allHjemmelIds = getAllHjemmelIds(ytelserToHjemler);

    // Prepare data for stacked bar chart (transposed)
    const seriesMap = new Map<string, number[]>();
    const percentagesMap = new Map<string, number[]>();

    // Create series for each ytelse
    for (const ytelse of ytelserToHjemler.values()) {
      seriesMap.set(ytelse.id, []);
      percentagesMap.set(ytelse.id, []);
    }

    // Collect hjemmel data with counts
    const hjemmelData = collectHjemmelData(allHjemmelIds, ytelserToHjemler, registreringshjemlerMap);

    // Sort hjemler by total count ascending, then by percentage as tie-breaker (reversed for display) and take top hjemler
    hjemmelData.sort((a, b) => {
      if (a.total !== b.total) {
        return a.total - b.total;
      }
      return a.avgPercentage - b.avgPercentage;
    });

    const topHjemler = maxHjemler === -1 ? hjemmelData : hjemmelData.slice(-maxHjemler);

    // Populate series and get names
    const hjemmelNames = populateSeries(topHjemler, ytelserToHjemler, seriesMap, percentagesMap);

    const series = Array.from(seriesMap.entries()).map(([ytelseId, counts]) => {
      const percentages = percentagesMap.get(ytelseId) ?? [];
      const dataWithPercentages = counts.map((count, index) => ({
        value: count,
        percentage: percentages[index] ?? 0,
      }));

      return {
        name: ytelserMap.get(ytelseId)?.navn ?? ytelseId,
        type: 'bar' as const,
        stack: 'total',
        data: dataWithPercentages,
        label: {
          show: true,
          position: 'inside' as const,
          formatter: (params: { data: { value: number } }) => {
            const count = params.data.value;
            return count > 0 ? `${count}` : '';
          },
        },
      };
    });

    return { hjemmelNames, series };
  }, [behandlinger, registreringshjemlerMap, ytelserMap, maxHjemler]);

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      option={{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params: unknown) => {
            if (!Array.isArray(params)) {
              return '';
            }
            const filtered = params.filter((item) => {
              const value = typeof item.value === 'number' ? item.value : 0;
              return value > 0;
            });
            if (filtered.length === 0) {
              return '';
            }
            const title = filtered[0].axisValueLabel;

            // Calculate total count and total percentage (weighted average)
            let totalCount = 0;
            let totalOmgjort = 0;
            let totalCases = 0;

            for (const item of filtered) {
              const count = typeof item.value === 'number' ? item.value : 0;
              const percentage = item.data?.percentage ?? 0;
              totalCount += count;
              totalOmgjort += count;
              // Calculate total cases from percentage: count / (percentage/100)
              if (percentage > 0) {
                const casesForThisYtelse = count / (percentage / 100);
                totalCases += casesForThisYtelse;
              }
            }

            const overallPercentage = totalCases > 0 ? (totalOmgjort / totalCases) * 100 : 0;

            const rows = filtered
              .map(({ value, data, marker, seriesName }) => {
                const percentage = data?.percentage ?? 0;
                return `
                  <tr>
                    <td>${marker}</td>
                    <td style="padding-left: 8px;">${seriesName}</td>
                    <td style="padding-left: 16px; font-weight: bold; text-align: right;">${value} (${typeof percentage === 'number' ? percentage.toFixed(1) : percentage} % av ${seriesName.toLowerCase()} saker)</td>
                  </tr>
                `;
              })
              .join('');

            const totalRow = `
              <tr style="border-top: 1px solid #ccc;">
                <td></td>
                <td style="padding-left: 8px; padding-top: 4px;"><strong>Total</strong></td>
                <td style="padding-left: 16px; font-weight: bold; text-align: right; padding-top: 4px;">${totalCount} (${overallPercentage.toFixed(1)} % av alle saker for ${filtered.length} ${filtered.length === 1 ? 'ytelse' : 'ytelser'})</td>
              </tr>
            `;

            return `
              <div style="font-weight: bold; margin-bottom: 8px;">${title}</div>
              <table style="width: 100%; border-collapse: collapse;">
                ${rows}${totalRow}
              </table>
            `;
          },
        },
        legend: {
          type: 'scroll',
          bottom: 0,
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: data.hjemmelNames,
        },
        series: data.series,
      }}
    />
  );
};
