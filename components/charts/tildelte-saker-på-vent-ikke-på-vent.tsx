'use client';

import { useMemo } from 'react';
import { COMMON_PIE_CHART_PROPS, COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import { percent } from '@/lib/percent';
import type { IKodeverkValue, PåVentReason, TildeltBehandling } from '@/lib/server/types';

interface Props {
  behandlinger: TildeltBehandling[];
  påVentReasons: IKodeverkValue<PåVentReason>[];
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
  type Entry = [Key, Data];
  const data = useMemo(() => {
    const map: Map<Key, Data> = new Map([
      [
        IKKE_PÅ_VENT_KEY,
        {
          id: IKKE_PÅ_VENT_KEY,
          name: IKKE_PÅ_VENT_DESCRIPTION,
          value: 0,
        },
      ],
      ...påVentReasons.map<Entry>((reason) => [
        reason.id,
        {
          id: reason.id,
          name: reason.beskrivelse,
          value: 0,
        },
      ]),
    ]);

    for (const behandling of behandlinger) {
      const { sattPaaVent } = behandling;
      const value = sattPaaVent === null ? IKKE_PÅ_VENT_KEY : sattPaaVent.reasonId;
      const existing = map.get(value);

      if (existing !== undefined) {
        existing.value += 1;
        continue;
      }

      if (value === IKKE_PÅ_VENT_KEY) {
        map.set(value, { name: IKKE_PÅ_VENT_DESCRIPTION, value: 1, id: value });
        continue;
      }

      const reason = påVentReasons.find((r) => r.id === value);

      map.set(value, { name: reason?.beskrivelse ?? 'Ukjent', value: 1, id: value });
    }

    return Array.from(map.values());
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
