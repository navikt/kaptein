'use client';

import { useMemo } from 'react';
import { COMMON_PIE_CHART_PROPS, COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { useAppTheme } from '@/lib/app-theme';
import { EChart } from '@/lib/echarts/echarts';
import { getSakstypePieChartColor } from '@/lib/echarts/get-colors';
import type { BaseBehandling, IKodeverkSimpleValue, Sakstype } from '@/lib/types';

interface Props {
  title: string;
  description: string;
  behandlinger: BaseBehandling[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
}

type Data = { value: number; name: string; itemStyle: { color: string } };

export const SakerPerSakstype = ({ title, description, behandlinger, sakstyper }: Props) => {
  const theme = useAppTheme();

  const data = useMemo(() => {
    const map = behandlinger.reduce<Map<Sakstype, Data>>((acc, curr) => {
      const existing = acc.get(curr.typeId);

      if (existing) {
        existing.value += 1;
      } else {
        acc.set(curr.typeId, {
          name: sakstyper.find((s) => s.id === curr.typeId)?.navn ?? (curr.typeId || curr.typeId),
          value: 1,
          itemStyle: { color: getSakstypePieChartColor(curr.typeId, theme) },
        });
      }

      return acc;
    }, new Map());

    return Object.values(Object.fromEntries(map));
  }, [behandlinger, sakstyper, theme]);

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      option={{
        ...COMMON_PIE_CHART_PROPS,
        series: [
          {
            ...COMMON_PIE_CHART_SERIES_PROPS,
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
