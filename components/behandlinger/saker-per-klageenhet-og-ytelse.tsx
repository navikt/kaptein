'use client';

import { VStack } from '@navikt/ds-react';
import { useMemo } from 'react';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue, IYtelse } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  ytelsekodeverk: IYtelse[];
  klageenheterkodeverk: IKodeverkSimpleValue[];
  sakstyperkoderverk: IKodeverkSimpleValue[];
}

export const SakerPerKlageenhetOgYtelse = ({
  behandlinger,
  ytelsekodeverk,
  klageenheterkodeverk,
  sakstyperkoderverk,
}: Props) => {
  const filteredBehandlinger = useMemo(() => behandlinger.filter((b) => b.tildeltEnhet !== null), [behandlinger]);

  const groupedByKlageenhet = useMemo(
    () =>
      filteredBehandlinger.reduce<Record<string, Behandling[]>>((acc, curr) => {
        if (curr.tildeltEnhet === null) {
          return acc;
        }

        const existing = acc[curr.tildeltEnhet] ?? [];
        existing.push(curr);
        acc[curr.tildeltEnhet] = existing;
        return acc;
      }, {}),
    [filteredBehandlinger],
  );

  const relevantYtelser = useMemo(() => {
    const ids = Array.from(new Set(filteredBehandlinger.map((b) => b.ytelseId)));

    return ids
      .map((id) => {
        const kodeverk = ytelsekodeverk.find((k) => k.id === id);

        return kodeverk === undefined ? { id, navn: id } : { id, navn: kodeverk.navn };
      })
      .toSorted((a, b) => a.navn.localeCompare(b.navn));
  }, [filteredBehandlinger, ytelsekodeverk]);

  return (
    <VStack className="h-full overflow-scroll">
      {relevantYtelser.map((ytelse) => (
        <Group
          key={ytelse.id}
          behandlinger={filteredBehandlinger.filter((b) => b.ytelseId === ytelse.id)}
          klageenheterkodeverk={klageenheterkodeverk}
          sakstyperkoderverk={sakstyperkoderverk}
          title={ytelse.navn}
        />
      ))}
    </VStack>
  );
};

interface GroupProps {
  behandlinger: Behandling[];
  klageenheterkodeverk: IKodeverkSimpleValue[];
  sakstyperkoderverk: IKodeverkSimpleValue[];
  title: string;
}

const Group = ({ behandlinger, klageenheterkodeverk, sakstyperkoderverk, title }: GroupProps) => {
  const series = useMemo(
    () =>
      sakstyperkoderverk.map((type) => ({
        type: 'bar',
        stack: 'total',
        label: { show: true },
        emphasis: { focus: 'series' },
        name: type.navn,
        data: klageenheterkodeverk
          .map(({ id }) =>
            behandlinger.reduce(
              (acc, curr) => (curr.tildeltEnhet === id && curr.typeId === type.id ? acc + 1 : acc),
              0,
            ),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, sakstyperkoderverk, klageenheterkodeverk],
  );

  return (
    <EChart
      option={{
        title: {
          text: title,
          // subtext: `Totalt: ${filteredBehandlinger.length} tildelte saker`,
        },
        tooltip: {
          confine: true,
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: klageenheterkodeverk.map((y) => y.navn),
        },
        series,
      }}
    />
  );
};
