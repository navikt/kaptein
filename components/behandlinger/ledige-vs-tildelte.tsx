'use client';

import { Alert, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
}

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

    return Object.values(Object.fromEntries(map));
  }, [behandlinger]);

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
          text: 'Tildelte/ledige saker',
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
