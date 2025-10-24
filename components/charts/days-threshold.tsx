'use client';

import { VStack } from '@navikt/ds-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { DayPicker } from '@/components/charts/common/day-picker';
import { NoData } from '@/components/no-data/no-data';
import { PieChart } from '@/lib/echarts/pie-chart';
import type { BaseBehandling } from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props<T extends BaseBehandling> {
  title: string;
  description: string;
  behandlinger: T[];
  getDays?: (b: T) => number;
  exceededName?: string;
  withinName?: string;
}

interface DaysData {
  name: string;
  value: number;
}

export const DaysThresholdPieChart = <T extends BaseBehandling>({
  title,
  description,
  behandlinger,
  getDays = (b) => b.ageKA,
  exceededName = 'Over',
  withinName = 'Innenfor',
}: Props<T>) => {
  const [maxDays, setMaxDays] = useQueryState(QueryParam.ALDER_MAX_DAYS, parseAsInteger);

  const { over, within } = useMemo(() => {
    let over = 0;
    let within = 0;
    const threshold = maxDays ?? 0;

    for (const behandling of behandlinger) {
      const days = getDays(behandling);

      if (days > threshold) {
        over++;
      } else {
        within++;
      }
    }

    return { over, within };
  }, [behandlinger, maxDays, getDays]);

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <VStack justify="center" align="center" gap="4" className="h-full">
      <DayPicker value={maxDays} setValue={setMaxDays} title={title} options={DAY_PICKER_OPTIONS} />
      <PieChart<DaysData>
        title={title}
        description={description}
        height="auto"
        className="grow"
        series={[
          {
            ...COMMON_PIE_CHART_SERIES_PROPS,
            color: ['var(--ax-accent-500)', 'var(--ax-danger-500)'],
            data: [
              {
                name: withinName,
                value: within,
              },
              {
                name: exceededName,
                value: over,
              },
            ],
            label: {
              formatter: ({ name, value }) =>
                `${name}: ${((value / behandlinger.length) * 100).toFixed(1)} % (${value} saker)`,
            },
            emphasis: { disabled: true },
          },
        ]}
      />
    </VStack>
  );
};

const DAY_PICKER_OPTIONS = [
  { numDays: 12 * 7, label: '12 uker' },
  { numDays: 15 * 7, label: '15 uker' },
];
