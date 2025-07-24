'use client';

import { Alert, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue, Sakstype } from '@/lib/server/types';

interface Props {
  total: number;
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue[];
}

export const AntallAktiveSaker = ({ behandlinger, sakstyper, total }: Props) => {
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

  if (data.length === 0) {
    return (
      <VStack align="center" justify="center" className="grow">
        <Alert variant="info">Ingen data</Alert>
      </VStack>
    );
  }

  return (
    <EChart
      option={{
        title: {
          text: 'Aktive saker',
          subtext: `Viser data for ${behandlinger.length} av totalt ${total} saker`,
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
