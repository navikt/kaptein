'use client';

import { isBefore } from 'date-fns';
import { useMemo } from 'react';
import { COMMON_PIE_CHART_PROPS, COMMON_PIE_CHART_SERIES_PROPS } from '@/components/behandlinger/common-chart-props';
import { ExceededFrist, useFristPieChartColors } from '@/components/behandlinger/use-frist-color';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
}

const TODAY = new Date();

const TITLE = 'Frist i Kabal';

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
            color,
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
