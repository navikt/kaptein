'use client';

import { VStack } from '@navikt/ds-react';
import { addDays, isBefore } from 'date-fns';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { DayPicker } from '@/components/behandlinger/day-picker';
import { ExceededFrist, useFristPieChartColors } from '@/components/behandlinger/use-frist-color';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  behandlinger: Behandling[];
}

const TODAY = new Date();

const TITLE = 'Overskredet varslet frist';

export const OverskredetVarsletFrist = ({ behandlinger }: Props) => {
  const [overskredetVarsletFrist, setOverskredetVarsletFrist] = useQueryState(
    QueryParam.OVERSKREDET_VARSLET_FRIST_DAYS,
    parseAsInteger,
  );

  const data = useMemo(() => {
    const map = behandlinger.reduce<Record<ExceededFrist, number>>(
      (acc, curr) => {
        const key =
          curr.varsletFrist === null
            ? ExceededFrist.NULL
            : isBefore(new Date(curr.varsletFrist), addDays(TODAY, overskredetVarsletFrist ?? 0))
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
  }, [behandlinger, overskredetVarsletFrist]);

  const color = useFristPieChartColors(data);

  if (behandlinger.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <VStack justify="center" align="center" gap="4" className="h-full">
      <DayPicker
        value={overskredetVarsletFrist}
        setValue={setOverskredetVarsletFrist}
        title="Overskredet med mer enn:"
        options={DAY_PICKER_OPTIONS}
      />
      <EChart
        height="auto"
        className="grow"
        option={{
          title: {
            text: TITLE,
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
    </VStack>
  );
};

const DAY_PICKER_OPTIONS = [
  {
    numDays: 0,
    label: '0 dager',
  },
  {
    numDays: 12 * 7,
    label: '12 uker',
  },
  {
    numDays: 15 * 7,
    label: '15 uker',
  },
];
