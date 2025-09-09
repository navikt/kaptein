'use client';

import { isBefore } from 'date-fns';
import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  relevantYtelser: IKodeverkSimpleValue[];
}
enum ExceededFrist {
  EXCEEDED = 'Overskredet',
  NOT_EXCEEDED = 'Innenfor varslet frist',
  NULL = 'Ingen varslet frist',
}

const getColor = (exceededFrist: ExceededFrist) => {
  switch (exceededFrist) {
    case ExceededFrist.EXCEEDED:
      return 'var(--ax-danger-600)';
    case ExceededFrist.NOT_EXCEEDED:
      return 'var(--ax-success-500)';
    case ExceededFrist.NULL:
      return 'var(--ax-neutral-400)';
  }
};

const TODAY = new Date();

const getData = (behandling: Behandling, exceeded: ExceededFrist): number => {
  switch (exceeded) {
    case ExceededFrist.NULL:
      return behandling.varsletFrist === null ? 1 : 0;
    case ExceededFrist.EXCEEDED:
      return behandling.varsletFrist !== null && isBefore(new Date(behandling.varsletFrist), TODAY) ? 1 : 0;
    case ExceededFrist.NOT_EXCEEDED:
      return behandling.varsletFrist !== null && !isBefore(new Date(behandling.varsletFrist), TODAY) ? 1 : 0;
  }
};

export const VarsletFristPerYtelse = ({ behandlinger, relevantYtelser }: Props) => {
  const series = useMemo(
    () =>
      Object.values(ExceededFrist).map((type) => ({
        type: 'bar',
        stack: 'total',
        label: { show: true },
        emphasis: { focus: 'series' },
        name: type,
        color: getColor(type),
        data: relevantYtelser
          .map(({ id }) =>
            behandlinger.reduce((acc, curr) => {
              return curr.ytelseId === id ? acc + getData(curr, type) : acc;
            }, 0),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, relevantYtelser],
  );

  const labels = relevantYtelser.map(
    (y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`,
  );

  return (
    <EChart
      option={{
        title: {
          text: 'Varslet frist per ytelse',
          subtext: `Viser data for ${behandlinger.length} saker`,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: labels,
        },
        series,
      }}
    />
  );
};
