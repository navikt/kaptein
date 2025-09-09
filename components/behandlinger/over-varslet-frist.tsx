'use client';

import { isAfter } from 'date-fns';
import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { AppTheme, useAppTheme } from '@/lib/app-theme';
import { ColorToken } from '@/lib/echarts/color-token';
import { DARK } from '@/lib/echarts/dark';
import { EChart } from '@/lib/echarts/echarts';
import { LIGHT } from '@/lib/echarts/light';
import type { Behandling } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
}

enum ExceededFrist {
  EXCEEDED = 'Overskredet',
  NOT_EXCEEDED = 'Innenfor frist',
  NULL = 'Ingen varslet frist',
}

const getTheme = (theme: AppTheme) => {
  switch (theme) {
    case AppTheme.LIGHT:
      return LIGHT;
    case AppTheme.DARK:
      return DARK;
  }
};

// Due to a bug in pie chart when hovering (emphasis) we have to hard code the colors instead of using tokens
const useColor = (data: { name: string }[]) => {
  const themeName = useAppTheme();
  const theme = getTheme(themeName);

  return data.map(({ name }) => {
    switch (name) {
      case ExceededFrist.EXCEEDED:
        return theme[ColorToken.Danger600];
      case ExceededFrist.NOT_EXCEEDED:
        return theme[ColorToken.Success500];
      case ExceededFrist.NULL:
        return theme[ColorToken.Neutral400];
      default:
        return theme[ColorToken.Warning500];
    }
  });
};

const TODAY = new Date();

export const OverVarsletFrist = ({ behandlinger }: Props) => {
  const data = useMemo(() => {
    const map = behandlinger.reduce<Record<ExceededFrist, number>>(
      (acc, curr) => {
        const key =
          curr.varsletFrist === null
            ? ExceededFrist.NULL
            : isAfter(new Date(curr.varsletFrist), TODAY)
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

  const color = useColor(data);

  if (data.length === 0) {
    return <NoData />;
  }

  return (
    <EChart
      option={{
        title: {
          text: 'Over varslet frist',
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
