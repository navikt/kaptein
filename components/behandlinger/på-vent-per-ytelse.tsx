'use client';

import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import { type AktivBehandling, type IKodeverkSimpleValue, type IKodeverkValue, PåVentReason } from '@/lib/server/types';

interface Props {
  behandlinger: AktivBehandling[];
  relevantYtelser: IKodeverkSimpleValue[];
  påVentReasons: IKodeverkValue[];
}

const TITLE = 'Behandlinger på vent grupper på ytelse';

export const PåVentPerYtelse = ({ behandlinger, relevantYtelser, påVentReasons }: Props) => {
  const påVentBehandlinger = useMemo(() => behandlinger.filter((b) => b.sattPaaVent !== null), [behandlinger]);

  const series = useMemo(
    () =>
      Object.values(PåVentReason).map((reason) => ({
        type: 'bar',
        stack: 'total',
        label: { show: true },
        emphasis: { focus: 'series' },
        name: påVentReasons.find((r) => r.id === reason)?.beskrivelse ?? reason,
        data: relevantYtelser
          .map(({ id }) =>
            påVentBehandlinger.reduce(
              (acc, curr) => (curr.ytelseId === id && curr.sattPaaVent?.reasonId === reason ? acc + 1 : acc),
              0,
            ),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [påVentBehandlinger, påVentReasons, relevantYtelser],
  );

  if (behandlinger.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <EChart
      option={{
        title: {
          text: TITLE,
          subtext: `Antall behandlinger på vent: ${påVentBehandlinger.length}`,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: relevantYtelser.map((y) => y.navn),
        },
        series,
      }}
    />
  );
};
