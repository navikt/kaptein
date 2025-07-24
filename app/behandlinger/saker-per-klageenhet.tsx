'use client';

import { Alert, VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue } from '@/lib/server/types';

interface Props {
  total: number;
  behandlinger: Behandling[];
  klageenheter: IKodeverkSimpleValue[];
}

export const SakerPerKlageenhet = ({ behandlinger, total, klageenheter }: Props) => {
  const data = useMemo(() => {
    const map = new Map<string, { value: number; name: string }>();

    behandlinger.forEach((b) => {
      const existing = map.get(b.fraNAVEnhet);

      if (existing) {
        existing.value += 1;
      } else {
        map.set(b.fraNAVEnhet, {
          name: klageenheter.find((k) => k.id === b.fraNAVEnhet)?.navn ?? b.fraNAVEnhet,
          value: 1,
        });
      }
    });

    return Object.values(Object.fromEntries(map));
  }, [behandlinger, klageenheter]);

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
          text: 'Saker per klageenhet',
          // subtext: `Viser data for ${filtered.length} aktive saker`,
          subtext: 'Feil data, siden vi bruker fraNAVEnhet i mangel av et annet felt)',
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
          },
        ],
      }}
    />
  );
};
