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

type TildeltBehandling = Omit<Behandling, 'tildeltEnhet'> & { tildeltEnhet: string };
export const SakerPerKlageenhet = ({ behandlinger, total, klageenheter }: Props) => {
  const data = useMemo<{ name: string; value: number }[]>(() => {
    const map = new Map<string | null, { value: number; name: string }>();

    behandlinger.forEach((b) => {
      const existing = map.get(b.tildeltEnhet);

      if (existing) {
        existing.value += 1;
      } else {
        map.set(b.tildeltEnhet, {
          name:
            b.tildeltEnhet === null
              ? 'Ikke tildelt'
              : (klageenheter.find((k) => k.id === b.tildeltEnhet)?.navn ?? b.tildeltEnhet),
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
          // subText: `Viser data for ${filtered.length} saker som er tildelt`,
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
