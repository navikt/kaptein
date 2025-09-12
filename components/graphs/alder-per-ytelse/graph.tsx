'use client';

import { VStack } from '@navikt/ds-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import { DayPicker } from '@/components/behandlinger/day-picker';
import type { State } from '@/components/graphs/alder-per-ytelse/types';
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

const TITLE = 'Alder per ytelse';

export const AlderPerYtelse = ({ finished, tildelt }: Props) => {
  const [maxAge, setMaxAge] = useQueryState(QueryParam.ALDER_PER_YTELSE_MAX_DAYS, parseAsInteger);

  const {
    isInitialized,
    isLoading,
    state: { labels, series },
    count,
  } = useGraphState<State>(Graph.ALDER_PER_YTELSE, { labels: [], series: [] }, { finished, tildelt });

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
              subtext: `Viser data for ${count} saker`,
            },
            legend: {},
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
              },
            },
            xAxis: {
              type: 'value',
            },
            yAxis: {
              type: 'category',
              data: labels,
            },
            series,
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
