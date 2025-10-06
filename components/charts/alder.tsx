'use client';

import { VStack } from '@navikt/ds-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { DayPicker } from '@/components/charts/common/day-picker';
import { Age, useAgePieChartColors } from '@/components/charts/common/use-frist-color';
import { NoData } from '@/components/no-data/no-data';
import { PieChart } from '@/lib/echarts/pie-chart';
import type { BaseBehandling } from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  behandlinger: Pick<BaseBehandling, 'ageKA'>[];
}

interface AgeData {
  name: string;
  value: number;
}

const TITLE = 'Alder';

export const Alder = ({ behandlinger }: Props) => {
  const [maxAge, setMaxAge] = useQueryState(QueryParam.ALDER_MAX_DAYS, parseAsInteger);

  const data = useMemo<AgeData[]>(() => {
    const map = behandlinger.reduce<Record<Age, number>>(
      (acc, curr) => {
        if (curr.ageKA > (maxAge ?? 0)) {
          acc[Age.OLDER] = acc[Age.OLDER] + 1;
        } else {
          acc[Age.YOUNGER] = acc[Age.YOUNGER] + 1;
        }

        return acc;
      },
      {
        [Age.OLDER]: 0,
        [Age.YOUNGER]: 0,
      },
    );

    return Object.entries(map)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [behandlinger, maxAge]);

  const color = useAgePieChartColors(data);

  if (behandlinger.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <VStack justify="center" align="center" gap="4" className="h-full">
      <DayPicker value={maxAge} setValue={setMaxAge} title="Alder" options={DAY_PICKER_OPTIONS} />
      <PieChart<AgeData>
        title={TITLE}
        description={`Viser data for ${behandlinger.length} saker`}
        height="auto"
        className="grow"
        series={[
          {
            ...COMMON_PIE_CHART_SERIES_PROPS,
            color,
            data,
            label: {
              formatter: ({ name, value }: { name: string; value: number }) => `${name}: ${value}`,
            },
          },
        ]}
      />
    </VStack>
  );
};

const DAY_PICKER_OPTIONS = [
  {
    numDays: 12 * 7,
    label: '12 uker',
  },
  {
    numDays: 15 * 7,
    label: '15 uker',
  },
];
