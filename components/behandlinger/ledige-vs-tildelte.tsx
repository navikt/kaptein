'use client';

import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
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
        title: {
          text: TITLE,
          subtext: `Viser data for ${behandlinger.length} saker`,
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data,
            label: {
              formatter: ({ name, value }: { name: string; value: number }) => `${name}: ${value}`,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }}
    />
  );
};
