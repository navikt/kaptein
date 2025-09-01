'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue, Sakstype } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue[];
}

export const Behandlinger = ({ behandlinger, sakstyper }: Props) => {
  const searchParams = useSearchParams();

  const ytelseFilter = searchParams.get('ytelser')?.split(',').filter(Boolean) || [];

  const filteredBehandlinger = useMemo(
    () => (ytelseFilter.length === 0 ? behandlinger : behandlinger.filter((b) => ytelseFilter.includes(b.ytelseId))),
    [behandlinger, ytelseFilter],
  );

  const data = Object.values(
    Object.fromEntries(
      filteredBehandlinger.reduce<Map<Sakstype, { value: number; name: string }>>((acc, curr) => {
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
      }, new Map()),
    ),
  );

  return (
    <div className="grow">
      <EChart
        option={{
          title: {
            text: 'Aktive saker',
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
    </div>
  );
};
