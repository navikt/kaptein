'use client';

import { useFristPieChartColors } from '@/components/behandlinger/use-frist-color';
import { GraphLoading } from '@/components/graphs/loading';
import { GraphStatus } from '@/components/graphs/status';
import type { State } from '@/components/graphs/varslet-frist/type';
import { NoData } from '@/components/no-data/no-data';
import { useGraphState } from '@/lib/client/use-graph-state';
import { EChart } from '@/lib/echarts/echarts';
import { Graph } from '@/lib/graphs';

interface Props {
  finished?: boolean;
  tildelt?: boolean;
}

const TITLE = 'Varslet frist';

export const VarsletFrist = ({ finished, tildelt }: Props) => {
  const { isInitialized, isLoading, state, count } = useGraphState<State>(Graph.VARSLET_FRIST, [], {
    finished,
    tildelt,
  });

  const color = useFristPieChartColors(state);

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

      <GraphStatus isLoading={isLoading} />
    </>
  );
};
