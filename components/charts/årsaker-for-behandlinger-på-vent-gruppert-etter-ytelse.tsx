'use client';

import { useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import {
  type BaseBehandling,
  type IKodeverkSimpleValue,
  type IKodeverkValue,
  PåVentReason,
  type Tildelt,
} from '@/lib/types';

interface Props {
  behandlinger: (BaseBehandling & Tildelt)[];
  relevantYtelser: IKodeverkSimpleValue[];
  påVentReasons: IKodeverkValue<PåVentReason>[];
}

const TITLE = 'Årsaker for behandlinger på vent gruppert etter ytelse';

export const ÅrsakerForBehandlingerPåVentGruppertEtterYtelse = ({
  behandlinger,
  relevantYtelser,
  påVentReasons,
}: Props) => {
  const påVentBehandlinger = useMemo(() => behandlinger.filter((b) => b.sattPaaVentReasonId !== null), [behandlinger]);

  const series = useMemo(
    () =>
      Object.values(PåVentReason).map((reason) => ({
        ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
        name: påVentReasons.find((r) => r.id === reason)?.beskrivelse ?? reason,
        data: relevantYtelser
          .map(({ id }) =>
            påVentBehandlinger.reduce(
              (acc, curr) => (curr.ytelseId === id && curr.sattPaaVentReasonId === reason ? acc + 1 : acc),
              0,
            ),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [påVentBehandlinger, påVentReasons, relevantYtelser],
  );

  const labels = useMemo(
    () => relevantYtelser.map((y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`),
    [relevantYtelser, series],
  );

  if (behandlinger.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <EChart
      option={{
        ...COMMON_STACKED_BAR_CHART_PROPS,
        title: { text: TITLE, subtext: `Antall behandlinger på vent: ${påVentBehandlinger.length}` },
        yAxis: { type: 'category', data: labels },
        series,
      }}
    />
  );
};
