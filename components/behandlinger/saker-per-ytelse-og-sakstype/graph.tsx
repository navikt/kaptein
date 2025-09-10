'use client';

import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { BoxNew, Loader, VStack } from '@navikt/ds-react';
import type { State } from '@/components/behandlinger/saker-per-ytelse-og-sakstype/types';
import { useGraphData } from '@/lib/client/use-graph-state';
import { EChart } from '@/lib/echarts/echarts';

const TITLE = 'Saker per ytelse og sakstype';

export const SakerPerYtelse = () => {
  const {
    isInitialized,
    isLoading,
    data: { series, labels, count },
  } = useGraphData<State>('/api/graphs/saker-per-ytelse-og-sakstype', { series: [], labels: [], count: 0 });

  if (!isInitialized) {
    return (
      <VStack width="100%" height="100%" align="center" justify="center" gap="2">
        <Loader size="3xlarge" />
        <span>Laster...</span>
      </VStack>
    );
  }

  if (count === 0) {
    return (
      <VStack width="100%" height="100%" align="center" justify="center" gap="2">
        <ExclamationmarkTriangleIcon aria-hidden fontSize={88} />
        <span>Ingen data</span>
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
