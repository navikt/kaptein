import { COMMON_PIE_CHART_SERIES_PROPS } from '@/components/charts/common/common-chart-props';
import { EChart } from '@/lib/echarts/echarts';
import { type Resultat, Utfall } from '@/lib/types';

interface Result {
  resultat: Resultat | null;
}

interface Props {
  behandlinger: Result[];
}

interface PieData {
  name: string;
  value: number;
}

export const Omgjøringsprosent = ({ behandlinger }: Props) => {
  const total = behandlinger.length;
  let medhold = 0;
  let delvisMedhold = 0;
  let opphevet = 0;

  for (const { resultat } of behandlinger) {
    if (resultat === null) {
      continue;
    }

    switch (resultat.utfallId) {
      case Utfall.MEDHOLD:
        medhold++;
        break;
      case Utfall.DELVIS_MEDHOLD:
        delvisMedhold++;
        break;
      case Utfall.OPPHEVET:
        opphevet++;
        break;
    }
  }

  if (total === 0) {
    return null;
  }

  const medholdProsent = Math.round((medhold / total) * 10000) / 100;
  const delvisMedholdProsent = Math.round((delvisMedhold / total) * 10000) / 100;
  const opphevetProsent = Math.round((opphevet / total) * 10000) / 100;
  const omgjøringsprosent = Math.round(((medhold + delvisMedhold + opphevet) / total) * 10000) / 100;
  const notOmgjøringsprosent = 100 - omgjøringsprosent;

  return (
    <EChart
      title="Omgjøringsprosent"
      description={`Basert på ${total} ferdigstilte saker.\nMedhold: ${medholdProsent.toFixed(2)}%, Delvis medhold: ${delvisMedholdProsent.toFixed(2)}%, Opphevet: ${opphevetProsent.toFixed(2)}%`}
      option={{
        series: [
          {
            ...COMMON_PIE_CHART_SERIES_PROPS,
            type: 'sunburst',
            name: 'Omgjøringsprosent',
            // color: ['var(--ax-accent-500)', 'var(--ax-danger-500)'],
            data: [
              {
                name: 'Omgjort',
                children: [
                  { name: 'Medhold', value: medholdProsent },
                  { name: 'Delvis medhold', value: delvisMedholdProsent },
                  { name: 'Opphevet', value: opphevetProsent },
                ],
              },
              { name: 'Ikke omgjort', value: notOmgjøringsprosent },
            ],
          },
        ],
      }}
    />
  );
};
