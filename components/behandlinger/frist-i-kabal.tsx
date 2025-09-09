'use client';

import { isBefore } from 'date-fns';
import { useMemo } from 'react';
import { ExceededFrist, useFristPieChartColors } from '@/components/behandlinger/use-frist-color';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
}

const TODAY = new Date();

export const FristIKabal = ({ behandlinger }: Props) => {
  const data = useMemo(() => {
    const map = behandlinger.reduce<Record<ExceededFrist, number>>(
      (acc, curr) => {
        const key =
          curr.frist === null
            ? ExceededFrist.NULL
            : isBefore(new Date(curr.frist), TODAY)
              ? ExceededFrist.EXCEEDED
              : ExceededFrist.NOT_EXCEEDED;

        acc[key] = acc[key] + 1;

        return acc;
      },
      {
        [ExceededFrist.EXCEEDED]: 0,
        [ExceededFrist.NOT_EXCEEDED]: 0,
        [ExceededFrist.NULL]: 0,
      },
    );

    return Object.entries(map)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [behandlinger]);

  const color = useFristPieChartColors(data);

  if (data.length === 0) {
    return <NoData />;
  }

  return (
    <EChart
      option={{
        title: {
          text: 'Frist i Kabal',
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
            color,
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
