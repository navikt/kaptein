'use client';

import type { State } from '@/components/behandlinger/saker-per-ytelse-og-sakstype/types';
import { GraphLoading } from '@/components/graphs/loading';
import { GraphStatus } from '@/components/graphs/status';
import { NoData } from '@/components/no-data/no-data';
import { useGraphState } from '@/lib/client/use-graph-state';
import { EChart } from '@/lib/echarts/echarts';

const TITLE = 'Saker per ytelse og sakstype';

export const SakerPerYtelse = () => {
  const {
    isInitialized,
    isLoading,
    state: { series, labels, count },
  } = useGraphState<State>('saker-per-ytelse-og-sakstype', { series: [], labels: [], count: 0 });

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
