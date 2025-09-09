'use client';

import { VStack } from '@navikt/ds-react';
import { addDays, isBefore } from 'date-fns';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { DayPicker } from '@/components/behandlinger/day-picker';
import { Age, getAgeColor } from '@/components/behandlinger/use-frist-color';
import { EChart } from '@/lib/echarts/echarts';
import type { Behandling, IKodeverkSimpleValue } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  behandlinger: Behandling[];
  relevantYtelser: IKodeverkSimpleValue[];
}

const TODAY = new Date();

const getData = (behandling: Behandling, age: Age, plusDays: number): number => {
  switch (age) {
    case Age.OLDER:
      return behandling.ageKA !== null && isBefore(new Date(behandling.ageKA), addDays(TODAY, plusDays)) ? 1 : 0;
    case Age.YOUNGER:
      return behandling.ageKA !== null && !isBefore(new Date(behandling.ageKA), addDays(TODAY, plusDays)) ? 1 : 0;
  }
};

export const AlderPerYtelse = ({ behandlinger, relevantYtelser }: Props) => {
  const [alderPlusDays, setAlderPlusDays] = useQueryState(QueryParam.ALDER_DAYS, parseAsInteger);

  const series = useMemo(
    () =>
      Object.values(Age).map((type) => ({
        type: 'bar',
        stack: 'total',
        label: { show: true },
        emphasis: { focus: 'series' },
        name: type,
        color: getAgeColor(type),
        data: relevantYtelser
          .map(({ id }) =>
            behandlinger.reduce(
              (acc, curr) => (curr.ytelseId === id ? acc + getData(curr, type, alderPlusDays ?? 0) : acc),
              0,
            ),
          )
          .map((value) => (value === 0 ? null : value)),
      })),
    [behandlinger, relevantYtelser, alderPlusDays],
  );

  const labels = relevantYtelser.map(
    (y, i) => `${y.navn} (${series.reduce((acc, curr) => acc + (curr.data[i] ?? 0), 0)})`,
  );

  return (
    <VStack justify="center" align="center" gap="4">
      <DayPicker value={alderPlusDays} setValue={setAlderPlusDays} />
      <EChart
        option={{
          title: {
            text: 'Alder per ytelse',
            subtext: `Viser data for ${behandlinger.length} saker`,
          },
          tooltip: {
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
            data: labels,
          },
          series,
        }}
      />
    </VStack>
  );
};
