'use client';

import type { State } from '@/components/graphs/ledige-vs-tildelte/types';
import { GraphLoading } from '@/components/graphs/loading';
import { GraphStatus } from '@/components/graphs/status';
import { NoData } from '@/components/no-data/no-data';
import { useGraphState } from '@/lib/client/use-graph-state';
import { EChart } from '@/lib/echarts/echarts';
import { Graph } from '@/lib/graphs';

interface Props {
  tildelt?: boolean;
  finished?: boolean;
}

const TITLE = 'Tildelte/ledige saker';

export const LedigeVsTildelte = ({ tildelt, finished }: Props) => {
  const { isInitialized, isLoading, state, count } = useGraphState<State>(Graph.LEDIGE_VS_TILDELTE, [], {
    tildelt,
    finished,
  });

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
            left: 'center',
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
