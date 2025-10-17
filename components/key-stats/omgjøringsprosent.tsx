import { COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { EChart } from '@/lib/echarts/echarts';
import {
  IKKE_OMGJØRINGSUTFALL,
  type IKodeverkSimpleValue,
  OMGJØRINGSUTFALL,
  type Resultat,
  UTFALL,
  Utfall,
} from '@/lib/types';

interface Result {
  resultat: Resultat | null;
}

interface Props {
  behandlinger: Result[];
  utfall: IKodeverkSimpleValue<Utfall>[];
}

export const Omgjøringsprosent = ({ behandlinger, utfall }: Props) => {
  const total = behandlinger.length;
  const utfallCounts: Record<Utfall, number> = {
    [Utfall.TRUKKET]: 0,
    [Utfall.RETUR]: 0,
    [Utfall.OPPHEVET]: 0,
    [Utfall.MEDHOLD]: 0,
    [Utfall.DELVIS_MEDHOLD]: 0,
    [Utfall.STADFESTET]: 0,
    [Utfall.UGUNST]: 0,
    [Utfall.AVVIST]: 0,
    [Utfall.INNSTILLING_STADFESTET]: 0,
    [Utfall.INNSTILLING_AVVIST]: 0,
    [Utfall.HEVET]: 0,
    [Utfall.HENVIST]: 0,
    [Utfall.MEDHOLD_FORVALTNINGSLOVEN_35]: 0,
    [Utfall.BESLUTNING_IKKE_OMGJOERE]: 0,
    [Utfall.STADFESTET_ANNEN_BEGRENNELSE]: 0,
    [Utfall.HENLAGT]: 0,
    [Utfall.INNSTILLING_GJENOPPTAS_VEDTAK_STADFESTES]: 0,
    [Utfall.INNSTILLING_GJENOPPTAS_IKKE]: 0,
    [Utfall.GJENOPPTATT_DELVIS_FULLT_MEDHOLD]: 0,
    [Utfall.GJENOPPTATT_OPPHEVET]: 0,
    [Utfall.GJENOPPTATT_STADFESTET]: 0,
    [Utfall.IKKE_GJENOPPTATT]: 0,
  };

  for (const { resultat } of behandlinger) {
    if (resultat === null) {
      continue;
    }

    for (const utfall of UTFALL) {
      if (resultat.utfallId === utfall) {
        utfallCounts[utfall]++;
      }
    }
  }

  if (total === 0) {
    return null;
  }

  const getOmgjortProsent = getOmgjortProsentFn(utfall, utfallCounts, total);

  return (
    <EChart
      title="Omgjøringsprosent"
      description={`Basert på ${total} ferdigstilte saker.`}
      option={{
        series: [
          {
            ...COMMON_PIE_CHART_SERIES_PROPS,
            type: 'sunburst',
            name: 'Omgjøringsprosent',
            // color: ['var(--ax-danger-500)', 'var(--ax-accent-500)'],
            data: [
              {
                name: 'Omgjort',
                // value: omgjøringsprosent,
                children: OMGJØRINGSUTFALL.map(getOmgjortProsent),
              },
              {
                name: 'Ikke omgjort',
                // value: notOmgjøringsprosent,
                children: IKKE_OMGJØRINGSUTFALL.map(getOmgjortProsent),
              },
            ],
          },
        ],
      }}
    />
  );
};

const getOmgjortProsentFn =
  (utfallList: IKodeverkSimpleValue<Utfall>[], counts: Record<Utfall, number>, total: number) => (utfall: Utfall) => {
    const name = utfallList.find((o) => o.id === utfall)?.navn || utfall;

    if (total === 0) {
      return { name: `${name} (0 %)`, value: 0 };
    }

    const value = Math.round((counts[utfall] / total) * 10000) / 100;

    return { name: `${name} (${value} %)`, value };
  };
