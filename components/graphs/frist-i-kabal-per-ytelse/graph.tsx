'use client';

import type { State } from '@/components/graphs/frist-i-kabal-per-ytelse/types';
import { GraphLoading } from '@/components/graphs/loading';
import { GraphStatus } from '@/components/graphs/status';
import { NoData } from '@/components/no-data/no-data';
import { useGraphState } from '@/lib/client/use-graph-state';
import { EChart } from '@/lib/echarts/echarts';
import { Graph } from '@/lib/graphs';

interface Props {
  finished?: boolean;
  tildelt?: boolean;
}

const TITLE = 'Frist i Kabal per ytelse';

export const FristIKabalPerYtelse = ({ finished, tildelt }: Props) => {
  const {
    isInitialized,
    isLoading,
    state: { labels, series },
    count,
  } = useGraphState<State>(
    Graph.FRIST_I_KABAL_PER_YTELSE,
    {
      labels: [],
      series: [],
    },
    { finished },
  );

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
