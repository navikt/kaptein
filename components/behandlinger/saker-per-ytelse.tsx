'use client';

import { Alert, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IYtelse } from '@/lib/server/types';

interface Props {
  total: number;
  behandlinger: Behandling[];
  ytelser: IYtelse[];
}

export const SakerPerYtelse = ({ behandlinger, total, ytelser }: Props) => {
  const data = useMemo(() => {
    const map = new Map<string, { value: number; name: string }>();

    behandlinger.slice(0, 10).forEach((b) => {
      const existing = map.get(b.ytelseId);

      if (existing) {
        existing.value += 1;
      } else {
        map.set(b.ytelseId, {
          name: ytelser.find((k) => k.id === b.ytelseId)?.navn ?? b.ytelseId,
          value: 1,
        });
      }
    });

    return Object.values(Object.fromEntries(map));
  }, [behandlinger, ytelser]);

  const labels = useMemo(() => data.map((d) => d.name), [data]);
  const values = useMemo(() => data.map((d) => d.value), [data]);

  if (data.length === 0) {
    return (
      <VStack align="center" justify="center" className="grow">
        <Alert variant="info">Ingen data</Alert>
      </VStack>
    );
  }

  return (
    <EChart
      option={{
        title: {
          text: 'Saker per ytelse',
          subtext: `Viser data for ${behandlinger.length} saker`,
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
        series: [
          {
            data: values,
            type: 'bar',
            barCategoryGap: '-90%',
          },
        ],
      }}
    />
  );
};
