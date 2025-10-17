import { EChart } from '@/lib/echarts/echarts';
import {
  ANKE_I_TR_IKKE_OMGJØRINGSUTFALL,
  ANKE_I_TR_OMGJØRINGSUTFALL,
  ANKE_I_TR_UTFALL,
  AnkeITRUtfall,
  type IKodeverkSimpleValue,
  type Resultat,
  Utfall,
} from '@/lib/types';

interface Result {
  resultat: Resultat<AnkeITRUtfall> | null;
}

interface Props {
  behandlinger: Result[];
  utfall: IKodeverkSimpleValue<Utfall | AnkeITRUtfall>[];
}

export const Omgjøringsprosent = ({ behandlinger, utfall }: Props) => {
  const total = behandlinger.length;
  const utfallCounts: Record<AnkeITRUtfall, number> = {
    [AnkeITRUtfall.OPPHEVET]: 0,
    [AnkeITRUtfall.MEDHOLD]: 0,
    [AnkeITRUtfall.DELVIS_MEDHOLD]: 0,
    [AnkeITRUtfall.STADFESTET]: 0,
    [AnkeITRUtfall.AVVIST]: 0,
    [AnkeITRUtfall.HEVET]: 0,
    [AnkeITRUtfall.HENVIST]: 0,
  };

  for (const { resultat } of behandlinger) {
    if (resultat === null) {
      continue;
    }

    for (const utfall of ANKE_I_TR_UTFALL) {
      if (resultat.utfallId === utfall) {
        utfallCounts[utfall]++;
      }
    }
  }

  if (total === 0) {
    return null;
  }

  // Count cases without utfall (resultat is null)
  const utenUtfallCount = behandlinger.filter(({ resultat }) => resultat === null).length;

  // Helper function to get utfall name
  const getUtfallName = (utfallId: AnkeITRUtfall) => {
    return utfall.find((o) => o.id === utfallId)?.navn ?? utfallId;
  };

  // Build Sankey data
  const nodes = [
    { name: 'Omgjort', depth: 0, itemStyle: { color: 'var(--ax-danger-500)' } },
    { name: 'Ikke omgjort', depth: 0, itemStyle: { color: 'var(--ax-accent-500)' } },
    ...(utenUtfallCount > 0
      ? [{ name: 'Uten utfall', depth: 0, value: utenUtfallCount, itemStyle: { color: 'var(--ax-neutral-500)' } }]
      : []),
    ...ANKE_I_TR_OMGJØRINGSUTFALL.filter((u) => utfallCounts[u] > 0).map((u) => ({
      name: getUtfallName(u),
      depth: 1,
      itemStyle: { color: UTFALL_COLORS[u] },
    })),
    ...ANKE_I_TR_IKKE_OMGJØRINGSUTFALL.filter((u) => utfallCounts[u] > 0).map((u) => ({
      name: getUtfallName(u),
      depth: 1,
      itemStyle: { color: UTFALL_COLORS[u] },
    })),
  ];

  const links = [
    // Omgjort to individual utfall
    ...ANKE_I_TR_OMGJØRINGSUTFALL.filter((u) => utfallCounts[u] > 0).map((u) => {
      const name = getUtfallName(u);
      return { source: 'Omgjort', target: name, value: utfallCounts[u] };
    }),
    // Ikke omgjort to individual utfall
    ...ANKE_I_TR_IKKE_OMGJØRINGSUTFALL.filter((u) => utfallCounts[u] > 0).map((u) => {
      const name = getUtfallName(u);
      return { source: 'Ikke omgjort', target: name, value: utfallCounts[u] };
    }),
  ];

  return (
    <EChart
      title="Utfallsfordeling"
      description={`Basert på ${total} ferdigstilte saker.`}
      option={{
        series: [
          {
            type: 'sankey',
            layout: 'none',
            emphasis: {
              focus: 'adjacency',
            },
            data: nodes,
            links,
            lineStyle: {
              color: 'gradient',
              curveness: 0.5,
            },
            label: {
              formatter: (params: { dataType?: string; value?: number; name?: string }) => {
                if (params.dataType === 'node' && params.value !== undefined && params.name !== undefined) {
                  const percentage = ((params.value / total) * 100).toFixed(1);
                  return `${params.name}\n${params.value} (${percentage}%)`;
                }
                return params.name ?? '';
              },
            },
          },
        ],
        tooltip: {
          trigger: 'item',
          formatter: (params: {
            dataType?: string;
            value?: number;
            name?: string;
            data?: { source?: string; target?: string };
          }) => {
            if (params.dataType === 'edge' && params.value !== undefined && params.data) {
              const percentage = ((params.value / total) * 100).toFixed(1);
              return `${params.data.source} → ${params.data.target}<br/>${params.value} (${percentage}%)`;
            }
            if (params.value !== undefined && params.name !== undefined) {
              const percentage = ((params.value / total) * 100).toFixed(1);
              return `${params.name}<br/>${params.value} (${percentage}%)`;
            }
            return params.name ?? '';
          },
        },
      }}
    />
  );
};

const UTFALL_COLORS: Record<AnkeITRUtfall, string> = {
  [Utfall.OPPHEVET]: 'var(--ax-warning-500)',
  [Utfall.MEDHOLD]: 'var(--ax-danger-500)',
  [Utfall.DELVIS_MEDHOLD]: 'var(--ax-warning-500)',
  [Utfall.STADFESTET]: 'var(--ax-success-500)',
  [Utfall.AVVIST]: 'var(--ax-accent-500)',
  [Utfall.HEVET]: 'var(--ax-meta-lime-500)',
  [Utfall.HENVIST]: 'var(--ax-meta-purple-500)',
};
