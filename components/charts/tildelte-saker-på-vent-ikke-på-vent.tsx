'use client';

import { useMemo } from 'react';
import { COMMON_PIE_CHART_PROPS, COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import { percent } from '@/lib/percent';
import type { IKodeverkValue, PåVentReason, TildeltBehandling } from '@/lib/server/types';

interface Props {
  behandlinger: TildeltBehandling[];
  påVentReasons: IKodeverkValue[];
}

const TITLE = 'Tildelte saker på vent / ikke på vent';
const IKKE_PÅ_VENT_DESCRIPTION = 'Ikke på vent';
const IKKE_PÅ_VENT_KEY = '-1';

type Key = PåVentReason | typeof IKKE_PÅ_VENT_KEY;

interface Data {
  id: Key;
  value: number;
  name: string;
}

export const TildelteSakerPåVentIkkePåVent = ({ behandlinger, påVentReasons }: Props) => {
  const data = useMemo(() => {
    const map = behandlinger.reduce<Map<Key, Data>>((acc, curr) => {
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
          id: value,
        });
      }

      return acc;
    }, new Map());

    return Object.values(Object.fromEntries(map));
  }, [behandlinger, påVentReasons]);

  const total = behandlinger.length;

  if (total === 0) {
    return <NoData title={TITLE} />;
  }

  const notWaiting = data.find((d) => d.id === IKKE_PÅ_VENT_KEY)?.value ?? 0;
  const waiting = total - notWaiting;

  return (
    <EChart
      option={{
        ...COMMON_PIE_CHART_PROPS,
        title: {
          text: TITLE,
          subtext: `Viser data for ${total} saker, hvorav ${waiting} (${percent(waiting, total)}) er på vent.`,
        },
        series: [
          {
            ...COMMON_PIE_CHART_SERIES_PROPS,
            data,
            label: {
              formatter: ({ name, value }: { name: string; value: number }) =>
                `${name}: ${value} (${percent(value, total)})`,
            },
          },
        ],
      }}
    />
  );
};
