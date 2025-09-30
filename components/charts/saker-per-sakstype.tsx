'use client';

import { useMemo } from 'react';
import { COMMON_PIE_CHART_PROPS, COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import { useSakstypeColor } from '@/lib/echarts/use-colors';
import type { BaseBehandling, IKodeverkSimpleValue, Sakstype } from '@/lib/types';

interface Props {
  behandlinger: BaseBehandling[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
}

const TITLE = 'Saker per sakstype';

export const SakerPerSakstype = ({ behandlinger, sakstyper }: Props) => {
  const data = useMemo(() => {
    const map = behandlinger.reduce<Map<Sakstype, { value: number; name: string }>>((acc, curr) => {
      const existing = acc.get(curr.typeId);

      if (existing) {
        existing.value += 1;
      } else {
        acc.set(curr.typeId, {
          name: sakstyper.find((s) => s.id === curr.typeId)?.navn ?? (curr.typeId || curr.typeId),
          value: 1,
        });
      }

      return acc;
    }, new Map());

    return Object.values(Object.fromEntries(map));
  }, [behandlinger, sakstyper]);

  const color = useSakstypeColor(behandlinger);

  if (behandlinger.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <EChart
      option={{
        ...COMMON_PIE_CHART_PROPS,
        title: { text: TITLE, subtext: `Viser data for ${behandlinger.length} saker` },
        series: [
          {
            ...COMMON_PIE_CHART_SERIES_PROPS,
            color,
            data,
            label: {
              formatter: ({ name, value }: { name: string; value: number }) => `${name}: ${value}`,
            },
          },
        ],
      }}
    />
  );
};
