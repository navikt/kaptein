'use client';

import { useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/charts/common/common-chart-props';
import { getYtelseIdsForEntry, useYtelseChartData } from '@/components/charts/common/use-ytelse-chart-data';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import { getPåVentReasonColor } from '@/lib/echarts/get-colors';
import {
  type BaseBehandling,
  type IKodeverkSimpleValue,
  type IKodeverkValue,
  PåVentReason,
  type Tildelt,
} from '@/lib/types';

interface Props {
  title: string;
  description: string;
  behandlinger: (BaseBehandling & Tildelt)[];
  relevantYtelser: IKodeverkSimpleValue[];
  påVentReasons: IKodeverkValue<PåVentReason>[];
}

export const ÅrsakerForBehandlingerPåVentGruppertEtterYtelse = ({
  title,
  description,
  behandlinger,
  relevantYtelser,
  påVentReasons,
}: Props) => {
  const påVentBehandlinger = useMemo(() => behandlinger.filter((b) => b.sattPaaVentReasonId !== null), [behandlinger]);
  const entries = useYtelseChartData(påVentBehandlinger, relevantYtelser);

  const series = useMemo(
    () =>
      Object.values(PåVentReason).map((reason) => ({
        ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
        name: påVentReasons.find((r) => r.id === reason)?.beskrivelse ?? reason,
        color: getPåVentReasonColor(reason),
        data: entries
          .map((entry) => countPåVentReason(påVentBehandlinger, getYtelseIdsForEntry(entry), reason))
          .map((value) => (value === 0 ? null : value)),
      })),
    [påVentBehandlinger, påVentReasons, entries],
  );

  const labels = useMemo(
    () => entries.map((entry, i) => `${entry.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`),
    [entries, series],
  );

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      option={{
        ...COMMON_STACKED_BAR_CHART_PROPS,
        yAxis: { type: 'category', data: labels },
        series,
        legend: { type: 'scroll' },
      }}
    />
  );
};

/**
 * Count behandlinger for a list of ytelseIds with a specific på vent reason
 */
const countPåVentReason = (
  behandlinger: (BaseBehandling & Tildelt)[],
  ytelseIds: string[],
  reason: PåVentReason,
): number =>
  behandlinger.reduce(
    (acc, curr) => (ytelseIds.includes(curr.ytelseId) && curr.sattPaaVentReasonId === reason ? acc + 1 : acc),
    0,
  );
