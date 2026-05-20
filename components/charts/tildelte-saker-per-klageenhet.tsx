'use client';

import { useMemo } from 'react';
import { COMMON_BAR_CHART_PROPS } from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { UNKNOWN_ENHET_ID, UNKNOWN_ENHET_NAME } from '@/lib/constants';
import { EChart } from '@/lib/echarts/echarts';
import type { BaseBehandling, IKodeverkSimpleValue } from '@/lib/types';

interface Props {
  title: string;
  description: string;
  behandlinger: Pick<BaseBehandling, 'tildeltEnhet'>[];
  klageenheter: IKodeverkSimpleValue[];
}

export const TildelteSakerPerKlageenhet = ({ behandlinger, klageenheter, title, description }: Props) => {
  const data = useMemo(() => {
    // Insert all klageenheter into the map with a default value of 0, so that we show all klageenheter in the chart even if they have no tildelte saker.
    // Also keeps the order consistent with the order of klageenheter.
    const map = new Map<string, { value: number; name: string }>(
      klageenheter.map(({ id, navn }) => [id, { name: navn, value: 0 }]),
    );

    for (const b of behandlinger) {
      if (b.tildeltEnhet === null) {
        const existing = map.get(UNKNOWN_ENHET_ID);

        if (existing !== undefined) {
          existing.value += 1;
          continue;
        }

        // If a behandling has a null tildeltEnhet and we haven't added the UNKNOWN_ENHET to the map, we add it here.
        map.set(UNKNOWN_ENHET_ID, { name: UNKNOWN_ENHET_NAME, value: 1 });
        continue;
      }

      const existing = map.get(b.tildeltEnhet);

      if (existing !== undefined) {
        existing.value += 1;
        continue;
      }

      // If a behandling has a tildeltEnhet that is not in klageenheter, we add it to the map.
      // This should be impossible, but we want to account for it just in case.
      map.set(b.tildeltEnhet, { name: b.tildeltEnhet, value: 1 });
    }

    return map.values().toArray();
  }, [behandlinger, klageenheter]);

  const labels = useMemo(() => data.map((d) => d.name), [data]);
  const values = useMemo(() => data.map((d) => d.value), [data]);

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      option={{
        ...COMMON_BAR_CHART_PROPS,
        yAxis: { type: 'category', data: labels },
        series: [{ data: values, type: 'bar', name: 'Tildelte saker' }],
      }}
    />
  );
};
