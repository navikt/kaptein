'use client';

import { useMemo } from 'react';
import { COMMON_PIE_CHART_PROPS, COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { AppTheme, useAppTheme } from '@/lib/app-theme';
import { browserLog } from '@/lib/browser-log';
import { ColorToken } from '@/lib/echarts/color-token';
import { DARK } from '@/lib/echarts/dark';
import { EChart } from '@/lib/echarts/echarts';
import { getPåVentReasonPieChartColor } from '@/lib/echarts/get-colors';
import { LIGHT } from '@/lib/echarts/light';
import { percent } from '@/lib/percent';
import type { BaseBehandling, IKodeverkValue, PåVentReason, Tildelt } from '@/lib/types';

interface Props {
  behandlinger: (BaseBehandling & Tildelt)[];
  påVentReasons: IKodeverkValue<PåVentReason>[];
}

const TITLE = 'Tildelte saker på vent / ikke på vent';
const IKKE_PÅ_VENT_DESCRIPTION = 'Ikke på vent';
const IKKE_PÅ_VENT_KEY = '-1';
const OTHER_KEY = '-2';
const OTHER_DESCRIPTION = 'Andre';

type Key = PåVentReason | typeof IKKE_PÅ_VENT_KEY | typeof OTHER_KEY;

interface Data {
  id: Key;
  value: number;
  name: string;
  itemStyle: { color: string };
}

type Entry = [Key, Data];

export const TildelteSakerPåVentIkkePåVent = ({ behandlinger, påVentReasons }: Props) => {
  const theme = useAppTheme();

  const data = useMemo(() => {
    const map: Map<Key, Data> = new Map([
      [
        IKKE_PÅ_VENT_KEY,
        {
          id: IKKE_PÅ_VENT_KEY,
          name: IKKE_PÅ_VENT_DESCRIPTION,
          value: 0,
          itemStyle: { color: getNotPåVentColor(theme) },
        },
      ],
      [OTHER_KEY, { id: OTHER_KEY, name: OTHER_DESCRIPTION, value: 0, itemStyle: { color: getOtherColor(theme) } }],
      ...påVentReasons.map<Entry>((reason) => [
        reason.id,
        {
          id: reason.id,
          name: reason.beskrivelse,
          value: 0,
          itemStyle: { color: getPåVentReasonPieChartColor(reason.id, theme) },
        },
      ]),
    ]);

    for (const behandling of behandlinger) {
      const { sattPaaVentReasonId } = behandling;
      const value = sattPaaVentReasonId ?? IKKE_PÅ_VENT_KEY;
      const existing = map.get(value);

      if (existing === undefined) {
        browserLog.warn(`Could not find på vent reason with id: ${value}, behandling: ${JSON.stringify(behandling)}`);
        const other = map.get(OTHER_KEY);

        if (other !== undefined) {
          other.value += 1;
        }
      } else {
        existing.value += 1;
      }
    }

    if (map.get(OTHER_KEY)?.value === 0) {
      map.delete(OTHER_KEY);
    }

    return Array.from(map.values());
  }, [behandlinger, påVentReasons, theme]);

  const total = behandlinger.length;

  if (total === 0) {
    return <NoData title={TITLE} />;
  }

  const notWaiting = data.find((d) => d.id === IKKE_PÅ_VENT_KEY)?.value ?? 0;
  const waiting = total - notWaiting;

  return (
    <EChart
      title={TITLE}
      description={`Viser data for ${total} aktive saker, hvorav ${waiting} (${percent(waiting, total)}) er på vent.`}
      option={{
        ...COMMON_PIE_CHART_PROPS,
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

const getNotPåVentColor = (theme: AppTheme): string => {
  switch (theme) {
    case AppTheme.LIGHT:
      return LIGHT[ColorToken.Success500];
    case AppTheme.DARK:
      return DARK[ColorToken.Success500];
  }
};

const getOtherColor = (theme: AppTheme): string => {
  switch (theme) {
    case AppTheme.LIGHT:
      return LIGHT[ColorToken.Neutral100];
    case AppTheme.DARK:
      return DARK[ColorToken.Neutral100];
  }
};
