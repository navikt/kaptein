'use client';

import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import { useSakstypeColor } from '@/lib/echarts/use-colors';
import type { Behandling, IKodeverkSimpleValue, Sakstype } from '@/lib/server/types';

interface Props {
  total: number;
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
}

const TITLE = 'Saker per sakstype';

export const SakerPerSakstype = ({ behandlinger, sakstyper, total }: Props) => {
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
        title: {
          text: TITLE,
          subtext: `Viser data for ${behandlinger.length} av totalt ${total} saker`,
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
