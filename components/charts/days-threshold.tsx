'use client';

import { VStack } from '@navikt/ds-react';
import { type ReactNode, useMemo } from 'react';
import { COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { DayPicker } from '@/components/charts/common/day-picker';
import { NoData } from '@/components/no-data/no-data';
import { PieChart } from '@/lib/echarts/pie-chart';
import { percent } from '@/lib/percent';
import { useAlderMaxDaysFilter } from '@/lib/query-state/query-state';
import type { BaseBehandling } from '@/lib/types';

interface Props<T extends BaseBehandling> {
  title: string;
  description: string;
  helpText: ReactNode;
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
  helpText,
}: Props<T>) => {
  const [maxDays, setMaxDays] = useAlderMaxDaysFilter();

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
    <VStack justify="center" align="center" gap="space-16" className="h-full">
      <DayPicker value={maxDays} setValue={setMaxDays} title={title} options={DAY_PICKER_OPTIONS} />
      <PieChart<DaysData>
        title={title}
        description={description}
        helpText={helpText}
        series={[
          {
            ...COMMON_PIE_CHART_SERIES_PROPS,
            top: -50,
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
              formatter: ({ name, value }) => `${name}: ${percent(value, behandlinger.length)} (${value} saker)`,
            },
            emphasis: { disabled: true },
          },
        ]}
      />
    </VStack>
  );
};

const TWELVE_WEEKS_IN_DAYS = 12 * 7;
const FIFTEEN_WEEKS_IN_DAYS = 15 * 7;

const DAY_PICKER_OPTIONS = [
  { numDays: TWELVE_WEEKS_IN_DAYS, label: '12 uker' },
  { numDays: FIFTEEN_WEEKS_IN_DAYS, label: '15 uker' },
];
