'use client';

import { useMemo } from 'react';
import { COMMON_PIE_CHART_PROPS, COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { IKodeverkValue, PåVentReason, TildeltBehandling } from '@/lib/server/types';

interface Props {
  behandlinger: TildeltBehandling[];
  påVentReasons: IKodeverkValue[];
}

const TITLE = 'Tildelte saker på vent / ikke på vent';
const IKKE_PÅ_VENT_DESCRIPTION = 'Ikke på vent';
const IKKE_PÅ_VENT_KEY = '-1';

export const TildelteSakerPåVentIkkePåVent = ({ behandlinger, påVentReasons }: Props) => {
  const data = useMemo(() => {
    const map = behandlinger.reduce<Map<PåVentReason | typeof IKKE_PÅ_VENT_KEY, { value: number; name: string }>>(
      (acc, curr) => {
        const { sattPaaVent } = curr;
        const value = sattPaaVent === null ? IKKE_PÅ_VENT_KEY : sattPaaVent.reasonId;
        const existing = acc.get(value);

        if (existing !== undefined) {
          existing.value += 1;
        } else {
          acc.set(value, {
            name:
              sattPaaVent === null
                ? IKKE_PÅ_VENT_DESCRIPTION
                : (påVentReasons.find((r) => r.id === sattPaaVent.reasonId)?.beskrivelse ?? 'Ukjent'),
            value: 1,
          });
        }

        return acc;
      },
      new Map(),
    );

    return Object.values(Object.fromEntries(map));
  }, [behandlinger, påVentReasons]);

  if (behandlinger.length === 0) {
    return <NoData title={TITLE} />;
  }

  return (
    <EChart
      option={{
        ...COMMON_PIE_CHART_PROPS,
        title: { text: TITLE, subtext: `Viser data for ${behandlinger.length} saker` },
        series: [
          {
            ...COMMON_PIE_CHART_SERIES_PROPS,
            data,
            label: {
              formatter: ({ name, value }: { name: string; value: number }) =>
                `${name}: ${value} (${((value / behandlinger.length) * 100).toFixed(1)}%)`,
            },
          },
        ],
      }}
    />
  );
};
