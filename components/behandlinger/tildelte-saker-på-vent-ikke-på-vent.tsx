'use client';

import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { AktivBehandling } from '@/lib/server/types';

interface Props {
  behandlinger: AktivBehandling[];
}

const TITLE = 'Tildelte saker på vent / ikke på vent';

export const TildelteSakerPåVentIkkePåVent = ({ behandlinger }: Props) => {
  const data = useMemo(() => {
    const map = behandlinger.reduce<Map<boolean, { value: number; name: string }>>((acc, curr) => {
      const value = curr.sattPaaVent === null;
      const existing = acc.get(value);

      if (existing) {
        existing.value += 1;
      } else {
        acc.set(value, {
          name: value ? 'Ikke på vent' : 'På vent',
          value: 1,
        });
      }
      return acc;
    }, new Map());

    return Object.values(Object.fromEntries(map));
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
