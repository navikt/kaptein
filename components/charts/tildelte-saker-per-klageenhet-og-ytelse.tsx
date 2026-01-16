'use client';

import { type ReactNode, useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/charts/common/common-chart-props';
import { getYtelseIdsForEntry, useYtelseChartData } from '@/components/charts/common/use-ytelse-chart-data';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, IKodeverkSimpleValue } from '@/lib/types';

interface Props {
  title: string;
  description?: string;
  helpText: ReactNode;
  behandlinger: (BaseBehandling & { tildeltEnhet: string })[];
  relevantYtelser: IKodeverkSimpleValue[];
  klageenheter: IKodeverkSimpleValue[];
}

export const TildelteSakerPerKlageenhetOgYtelse = ({
  behandlinger,
  relevantYtelser,
  klageenheter,
  title,
  description = `Viser data for ${behandlinger.length} tildelte saker`,
  helpText,
}: Props) => {
  const entries = useYtelseChartData(behandlinger, relevantYtelser);

  const series = useMemo(
    () =>
      entries.map((entry) => ({
        ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
        name: entry.navn,
        data: klageenheter
          .map((enhet) => countEnhet(behandlinger, getYtelseIdsForEntry(entry), enhet.id))
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, entries, klageenheter],
  );

  const labels = useMemo(
    () => klageenheter.map((e, i) => `${e.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`),
    [klageenheter, series],
  );

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      helpText={helpText}
      option={{
        ...COMMON_STACKED_BAR_CHART_PROPS,
        yAxis: { type: 'category', data: labels },
        series,
        legend: {
          show: true,
          type: 'scroll',
          orient: 'horizontal',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params: unknown) => {
            if (!Array.isArray(params) || params.length === 0) {
              return '';
            }

            const axisValue = params[0].axisValue;

            let rows = '';

            for (const { value, marker, seriesName } of params) {
              if (value !== null && value > 0) {
                rows += `<tr><td>${marker} ${seriesName}</td><td class="text-left pl-5 font-ax-bold">${value}</td></tr>`;
              }
            }

            const title = `<h1 class="pb-1 text-base font-ax-bold">${axisValue}</h1>`;

            if (rows.length === 0) {
              return `${title}<p>Ingen saker</p>`;
            }

            return `${title}<table>${rows}</table>`;
          },
        },
      }}
    />
  );
};

/**
 * Count behandlinger for a list of ytelseIds with a specific klageenhet
 */
const countEnhet = (
  behandlinger: (BaseBehandling & { tildeltEnhet: string })[],
  ytelseIds: string[],
  enhetId: string,
): number =>
  behandlinger.reduce(
    (acc, curr) => (ytelseIds.includes(curr.ytelseId) && curr.tildeltEnhet === enhetId ? acc + 1 : acc),
    0,
  );
