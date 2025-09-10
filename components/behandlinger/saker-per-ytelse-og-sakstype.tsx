'use client';

import { BoxNew, Loader, VStack } from '@navikt/ds-react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [{ series, labels, count }, setState] = useState<State>({ series: [], labels: [], count: -1 });

  const params = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    const eventSource = new ServerSentEventManager('/api/graphs/saker-per-ytelse-og-sakstype', params);

    eventSource.addJsonEventListener<State>('graph', (s) => {
      setState(s);
      setIsLoading(false);
    });

    return () => {
      eventSource.close();
    };
  }, [params]);

  const hasData = count !== -1;

  if (!hasData) {
    return (
      <VStack width="100%" height="100%" align="center" justify="center" gap="2">
        <Loader size="3xlarge" />
        <span>Laster...</span>
      </VStack>
    );
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

      {isLoading ? (
        <BoxNew asChild position="absolute" top="0" left="0" right="0" bottom="0" background="overlay">
          <VStack align="center" justify="center" gap="2">
            <Loader size="3xlarge" />
            <span>Oppdaterer...</span>
          </VStack>
        </BoxNew>
      ) : null}
    </>
  );
};
