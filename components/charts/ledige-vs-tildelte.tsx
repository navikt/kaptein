'use client';

import { useMemo } from 'react';
import { COMMON_PIE_CHART_PROPS, COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { Ledig, Tildelt } from '@/lib/types';

interface Props {
  behandlinger: (Tildelt | Ledig)[];
}

const TITLE = 'Tildelte/ledige saker';

export const LedigeVsTildelte = ({ behandlinger }: Props) => {
  const data = useMemo(() => {
    const map = behandlinger.reduce<Map<boolean, { value: number; name: string }>>((acc, curr) => {
      const existing = acc.get(curr.isTildelt);

      if (existing) {
        existing.value += 1;
      } else {
        acc.set(curr.isTildelt, {
          name: curr.isTildelt ? 'Tildelt' : 'Ledig',
          value: 1,
        });
      }

      return acc;
    }, new Map());

    return [...map.values()];
  }, [behandlinger]);

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
