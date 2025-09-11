'use client';

import type { State } from '@/components/graphs/saker-per-sakstype/types';
import { NoData } from '@/components/no-data/no-data';
import { useGraphState } from '@/lib/client/use-graph-state';
import { EChart } from '@/lib/echarts/echarts';
import { useSakstypeColor } from '@/lib/echarts/use-colors';
import { Graph } from '@/lib/graphs';

interface Props {
  finished?: boolean;
  tildelt?: boolean;
}

const TITLE = 'Saker per sakstype';

export const SakerPerSakstype = ({ finished, tildelt }: Props) => {
  const { isInitialized, isLoading, state, count } = useGraphState<State>(
    Graph.SAKER_PER_SAKSTYPE,
    { data: [], colors: [] },
    { finished, tildelt },
  );

  const color = useSakstypeColor(state);

  if (count === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <EChart
      option={{
        title: {
          text: TITLE,
          subtext: `Viser data for ${count} saker`,
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
  );
};
