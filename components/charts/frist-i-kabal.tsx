'use client';

import { isAfter } from 'date-fns';
import { useMemo } from 'react';
import { COMMON_PIE_CHART_PROPS, COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { ExceededFrist, useFristPieChartColors } from '@/components/charts/common/use-frist-color';
import { NoData } from '@/components/no-data/no-data';
import { TODAY } from '@/lib/date';
import { EChart } from '@/lib/echarts/echarts';
import { type FristBehandling, isFerdigstilt } from '@/lib/types';

interface Props {
  behandlinger: FristBehandling[];
}

const TITLE = 'Frist i Kabal';

export const FristIKabal = ({ behandlinger }: Props) => {
  const data = useMemo(() => {
    const map = behandlinger.reduce<Record<ExceededFrist, number>>(
      (acc, curr) => {
        const key = getExceededFrist(curr);

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
      title={TITLE}
      description={`Viser data for ${behandlinger.length} saker`}
      option={{
        ...COMMON_PIE_CHART_PROPS,
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

const getExceededFrist = (b: FristBehandling) => {
  if (b.frist === null) {
    return ExceededFrist.NULL;
  }

  if (isFerdigstilt(b)) {
    return isAfter(new Date(b.avsluttetAvSaksbehandlerDate), new Date(b.frist))
      ? ExceededFrist.EXCEEDED
      : ExceededFrist.NOT_EXCEEDED;
  }

  return isAfter(TODAY, new Date(b.frist)) ? ExceededFrist.EXCEEDED : ExceededFrist.NOT_EXCEEDED;
};
