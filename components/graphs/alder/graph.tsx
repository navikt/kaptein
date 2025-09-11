'use client';

import { VStack } from '@navikt/ds-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { DayPicker } from '@/components/behandlinger/day-picker';
import { useAgePieChartColors } from '@/components/behandlinger/use-frist-color';
import type { Serie } from '@/components/graphs/alder/types';
import { GraphLoading } from '@/components/graphs/loading';
import { GraphStatus } from '@/components/graphs/status';
import { NoData } from '@/components/no-data/no-data';
import { useGraphState } from '@/lib/client/use-graph-state';
import { EChart } from '@/lib/echarts/echarts';
import { Graph } from '@/lib/graphs';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  finished?: boolean;
  tildelt?: boolean;
}

const TITLE = 'Alder';

export const Alder = ({ finished, tildelt }: Props) => {
  const [maxAge, setMaxAge] = useQueryState(QueryParam.ALDER_MAX_DAYS, parseAsInteger);

  const { isInitialized, isLoading, state, count } = useGraphState<Serie>(Graph.ALDER, [], { finished, tildelt });

  const color = useAgePieChartColors(state);

  if (!isInitialized) {
    return <GraphLoading />;
  }

  if (count === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <>
      <VStack justify="center" align="center" gap="4" className="h-full">
        <DayPicker value={maxAge} setValue={setMaxAge} title="Alder" options={DAY_PICKER_OPTIONS} />
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
                data: state,
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

      <GraphStatus isLoading={isLoading} />
    </>
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
