'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ServerSentEventManager } from '@/lib/client/server-sent-events';
import { EChart } from '@/lib/echarts/echarts';

interface Serie {
  type: string;
  stack: string;
  label: {
    show: boolean;
  };
  emphasis: {
    focus: string;
  };
  name: string;
  color: string;
  data: (number | null)[];
}

interface State {
  series: Serie[];
  labels: string[];
  count: number;
}

const TITLE = 'Saker per ytelse og sakstype';

export const SakerPerYtelse = () => {
  const [{ series, labels, count }, setState] = useState<State>({ series: [], labels: [], count: 0 });

  const params = useSearchParams();

  useEffect(() => {
    const eventSource = new ServerSentEventManager(`/api/graphs/saker-per-ytelse-og-sakstype?${params.toString()}`);

    eventSource.addJsonEventListener<State>('graph', setState);

    return () => {
      eventSource.close();
    };
  }, [params]);

  const isLoading = series.length === 0;

  if (isLoading) {
    return <div>Laster...</div>;
  }

  return (
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
  );
};
