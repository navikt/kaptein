'use client';

import { useMemo } from 'react';
import { COMMON_PIE_CHART_PROPS, COMMON_PIE_CHART_SERIES_PROPS } from '@/components/behandlinger/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { TildeltBehandling } from '@/lib/server/types';

interface Props {
  behandlinger: TildeltBehandling[];
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
