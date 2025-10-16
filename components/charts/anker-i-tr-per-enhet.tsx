'use client';

import { useMemo } from 'react';
import {
  COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
  COMMON_STACKED_BAR_CHART_PROPS,
} from '@/components/charts/common/common-chart-props';
import { NoData } from '@/components/no-data/no-data';
import { ColorToken } from '@/lib/echarts/color-token';
import { EChart } from '@/lib/echarts/echarts';
import type { IKodeverkSimpleValue } from '@/lib/types';

interface Props {
  title: string;
  description?: string;
  behandlinger: { tildeltEnhet: string; avsluttetAvSaksbehandlerDate?: string }[];
  klageenheter: IKodeverkSimpleValue[];
}

export const AnkerITRSakerPerKlageenhet = ({
  behandlinger,
  klageenheter,
  title,
  description = `Viser data for ${behandlinger.length} tildelte saker`,
}: Props) => {
  const klageenheterMap = useMemo(() => {
    const map = new Map<string, string>();

    for (const { id, navn } of klageenheter) {
      map.set(id, navn);
    }

    return map;
  }, [klageenheter]);

  interface DataEntry {
    name: string;
    uferdige: number;
    ferdigstilte: number;
  }

  interface Data {
    labels: string[];
    uferdige: number[];
    ferdigstilte: number[];
  }

  const { labels, uferdige, ferdigstilte } = useMemo<Data>(() => {
    const map = new Map<string | null, DataEntry>();

    behandlinger.forEach((b) => {
      const existing = map.get(b.tildeltEnhet);

      if (existing !== undefined) {
        if (b.avsluttetAvSaksbehandlerDate === undefined) {
          existing.uferdige += 1;
        } else {
          existing.ferdigstilte += 1;
        }
      } else {
        if (b.avsluttetAvSaksbehandlerDate === undefined) {
          map.set(b.tildeltEnhet, {
            name: klageenheterMap.get(b.tildeltEnhet) ?? b.tildeltEnhet,
            uferdige: 1,
            ferdigstilte: 0,
          });
        } else {
          map.set(b.tildeltEnhet, {
            name: klageenheterMap.get(b.tildeltEnhet) ?? b.tildeltEnhet,
            uferdige: 0,
            ferdigstilte: 1,
          });
        }
      }
    });

    const labels: string[] = [];
    const uferdige: number[] = [];
    const ferdigstilte: number[] = [];

    const sortedEntries = map
      .values()
      .toArray()
      .toSorted((a, b) => a.name.localeCompare(b.name, 'nb'));

    for (const entry of sortedEntries) {
      labels.push(entry.name);
      uferdige.push(entry.uferdige);
      ferdigstilte.push(entry.ferdigstilte);
    }

    return { labels, uferdige, ferdigstilte };
  }, [behandlinger, klageenheterMap]);

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      option={{
        ...COMMON_STACKED_BAR_CHART_PROPS,
        yAxis: { type: 'category', data: labels },
        series: [
          {
            ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
            data: uferdige,
            type: 'bar',
            stack: 'total',
            name: 'Uferdige',
            color: `var(--ax-${ColorToken.Warning500})`,
          },
          {
            ...COMMMON_STACKED_BAR_CHART_SERIES_PROPS,
            data: ferdigstilte,
            type: 'bar',
            stack: 'total',
            name: 'Ferdigstilte',
            color: `var(--ax-${ColorToken.Accent500})`,
          },
        ],
      }}
    />
  );
};
