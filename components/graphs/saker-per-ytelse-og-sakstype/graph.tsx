'use client';

import { GraphLoading } from '@/components/graphs/loading';
import type { State } from '@/components/graphs/saker-per-ytelse-og-sakstype/types';
import { GraphStatus } from '@/components/graphs/status';
import { NoData } from '@/components/no-data/no-data';
import { useGraphState } from '@/lib/client/use-graph-state';
import { EChart } from '@/lib/echarts/echarts';
import { Graph } from '@/lib/graphs';

interface Props {
  finished?: boolean;
  tildelt?: boolean;
}

const TITLE = 'Saker per ytelse og sakstype';

export const SakerPerYtelseOgSakstype = ({ finished, tildelt }: Props) => {
  const {
    isInitialized,
    isLoading,
    state: { series, labels },
    count,
  } = useGraphState<State>(Graph.SAKER_PER_YTELSE_OG_SAKSTYPE, { series: [], labels: [] }, { finished, tildelt });

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
