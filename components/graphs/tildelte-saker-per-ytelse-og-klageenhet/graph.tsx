'use client';

import { GraphLoading } from '@/components/graphs/loading';
import { GraphStatus } from '@/components/graphs/status';
import type { State } from '@/components/graphs/tildelte-saker-per-ytelse-og-klageenhet/types';
import { NoData } from '@/components/no-data/no-data';
import { useGraphState } from '@/lib/client/use-graph-state';
import { EChart } from '@/lib/echarts/echarts';
import { Graph } from '@/lib/graphs';

interface Props {
  title: string;
  finished?: boolean;
  tildelt?: boolean;
}

export const TildelteSakerPerYtelseOgKlageenhet = ({ title, finished, tildelt }: Props) => {
  const {
    isInitialized,
    isLoading,
    state: { labels, series },
    count,
  } = useGraphState<State>(
    Graph.TILDELTE_SAKER_PER_YTELSE_OG_KLAGEENHET,
    { labels: [], series: [] },
    { finished, tildelt },
  );

  if (!isInitialized) {
    return <GraphLoading />;
  }

  if (count === 0) {
    return <NoData title={title} />;
  }

  return (
    <>
      <EChart
        option={{
          title: {
            text: title,
            subtext: `Viser data for ${count} tildelte saker`,
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
