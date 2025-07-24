'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue, Sakstype } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue[];
}

export const Behandlinger = ({ behandlinger, sakstyper }: Props) => {
  const [ytelseFilter] = useQueryState('ytelser', parseAsArrayOf(parseAsString));

  const ytelser = ytelseFilter ?? [];

  const data = useMemo(() => {
    const filtered = ytelser.length === 0 ? behandlinger : behandlinger.filter((b) => ytelser.includes(b.ytelseId));

    const map = filtered.reduce<Map<Sakstype, { value: number; name: string }>>((acc, curr) => {
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
  }, [behandlinger, sakstyper, ytelser]);

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
