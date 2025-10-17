'use client';

import { useMemo } from 'react';
import { NoData } from '@/components/no-data/no-data';
import { EChart } from '@/lib/echarts/echarts';
import type { AnkeITRFerdigstilt, IKodeverkSimpleValue, IYtelse, RegistreringshjemlerMap } from '@/lib/types';

interface Props {
  title: string;
  description: string;
  behandlinger: AnkeITRFerdigstilt[];
  klageenheter: IKodeverkSimpleValue[];
  ytelser: IYtelse[];
  registreringshjemlerMap: RegistreringshjemlerMap;
}

const OPPHEVET = '3';
const MEDHOL = '4';
const DELVIS_MEDHOLD = '5';

interface Branch {
  name: string;
  value: number;
  children?: Branch[];
}

interface HjemmelBranch {
  id: string;
  omgjort: number;
  ikkeOmgjort: number;
}

interface YtelseBranch {
  id: string;
  children: Map<string, HjemmelBranch>;
}

export const HjemlerMedhold = ({ title, description, ytelser, registreringshjemlerMap, behandlinger }: Props) => {
  console.log('HjemlerMedhold render', registreringshjemlerMap);

  const ytelserMap = useMemo(() => {
    const map = new Map<string, IKodeverkSimpleValue>();
    for (const ytelse of ytelser) {
      map.set(ytelse.id, ytelse);
    }
    return map;
  }, [ytelser]);

  // «medhold», «delvis medhold» og «opphevet»
  const data = useMemo<Branch[]>(() => {
    const branches = new Map<string, YtelseBranch>();

    for (const behandling of behandlinger) {
      const { resultat, ytelseId } = behandling;

      if (resultat === null) {
        continue;
      }

      const { utfallId, registreringshjemmelIdList } = resultat;

      const isOmgjort = utfallId === OPPHEVET || utfallId === MEDHOL || utfallId === DELVIS_MEDHOLD;

      const ytelse = branches.get(ytelseId) ?? { id: ytelseId, value: 0, children: new Map() };
      branches.set(ytelseId, ytelse);

      for (const hjemmelId of registreringshjemmelIdList) {
        const hjemmel: HjemmelBranch = ytelse.children.get(hjemmelId) ?? {
          id: hjemmelId,
          omgjort: 0,
          ikkeOmgjort: 0,
        };

        if (isOmgjort) {
          hjemmel.omgjort += 1;
        } else {
          hjemmel.ikkeOmgjort += 1;
        }

        ytelse.children.set(hjemmelId, hjemmel);
      }
    }

    return Array.from(branches.values()).map<Branch>((ytelse) => {
      const hjemler = ytelse.children
        .values()
        .map<Branch>(({ id, omgjort, ikkeOmgjort }) => ({
          name: registreringshjemlerMap[id]?.hjemmelnavn ?? id,
          value: (omgjort / (ikkeOmgjort + omgjort)) * 100,
        }))
        .toArray();

      return {
        name: ytelserMap.get(ytelse.id)?.navn ?? ytelse.id,
        value: hjemler.reduce((acc, curr) => acc + curr.value, 0),
        children: hjemler,
      };
    });
  }, [behandlinger, registreringshjemlerMap, ytelserMap]);

  if (behandlinger.length === 0) {
    return <NoData title={title} />;
  }

  return (
    <EChart
      title={title}
      description={description}
      option={{
        series: [
          {
            type: 'treemap',
            data: data,
            levels: [
              {
                itemStyle: {
                  gapWidth: 1,
                },
              },
            ],
          },
        ],
      }}
    />
  );
};
