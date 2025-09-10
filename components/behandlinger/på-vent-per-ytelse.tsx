'use client';

import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import { type Behandling, type IKodeverkValue, type IYtelse, PåVentReason } from '@/lib/server/types';

interface Props {
  total: number;
  behandlinger: Behandling[];
  ytelsekodeverk: IYtelse[];
  påVentReasons: IKodeverkValue[];
}

const TITLE = 'Behandlinger på vent grupper på ytelse';

export const PåVentPerYtelse = ({ behandlinger, total, ytelsekodeverk, påVentReasons }: Props) => {
  const påVentBehandlinger = useMemo(() => behandlinger.filter((b) => b.sattPaaVent !== null), [behandlinger]);

  const relevantYtelser = useMemo(() => {
    const ids = Array.from(new Set(påVentBehandlinger.map((b) => b.ytelseId)));

    return ids
      .map((id) => {
        const kodeverk = ytelsekodeverk.find((k) => k.id === id);

        return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
      })
      .toSorted((a, b) => a.navn.localeCompare(b.navn));
  }, [påVentBehandlinger, ytelsekodeverk]);

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
          subtext: `Antall behandlinger på vent: ${påVentBehandlinger.length} av totalt ${total} saker`,
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
