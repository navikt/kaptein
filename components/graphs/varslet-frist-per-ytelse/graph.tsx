'use client';

import { GraphLoading } from '@/components/graphs/loading';
import { GraphStatus } from '@/components/graphs/status';
import type { State } from '@/components/graphs/varslet-frist-per-ytelse/types';
import { NoData } from '@/components/no-data/no-data';
import { useGraphState } from '@/lib/client/use-graph-state';
import { EChart } from '@/lib/echarts/echarts';
import { Graph } from '@/lib/graphs';

interface Props {
  tildelt?: boolean;
  finished?: boolean;
}

const TITLE = 'Varslet frist per ytelse';

export const VarsletFristPerYtelse = ({ tildelt, finished }: Props) => {
  const {
    isInitialized,
    isLoading,
    state: { labels, series },
    count,
  } = useGraphState<State>(Graph.VARSLET_FRIST_PER_YTELSE, { labels: [], series: [] }, { tildelt, finished });

  if (!isInitialized) {
    return <GraphLoading />;
  }

  if (count === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <>
      <EChart
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

      <GraphStatus isLoading={isLoading} />
    </>
  );
};
