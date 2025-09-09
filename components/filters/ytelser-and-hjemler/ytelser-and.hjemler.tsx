'use client';

import { BoxNew, VStack } from '@navikt/ds-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { Innsendingshjemler } from '@/components/filters/ytelser-and-hjemler/innsendingshjemler';
import { Registreringshjemler } from '@/components/filters/ytelser-and-hjemler/registreringshjemler';
import type { IKodeverkValue, IYtelse } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  ytelser: IYtelse[];
  lovkildeToRegistreringshjemler: IKodeverkValue[];
}

export const YtelserAndHjemler = ({ ytelser, lovkildeToRegistreringshjemler }: Props) => {
  const [selectedYtelser, setSelectedYtelser] = useQueryState(QueryParam.YTELSER, parseAsArrayOf(parseAsString));

  const ytelserOptions = useMemo(() => ytelser.map(({ navn, id }) => ({ label: navn, value: id })), [ytelser]);
  const relevantKodeverk = useMemo(
    () =>
      selectedYtelser === null || selectedYtelser.length === 0
        ? ytelser
        : ytelser.filter((y) => selectedYtelser.includes(y.id)),
    [selectedYtelser, ytelser],
  );

  return (
    <VStack asChild gap="4">
      <BoxNew padding="3" borderRadius="medium" borderColor="neutral" borderWidth="1">
        <MultiselectFilter
          label="Ytelser"
          selected={selectedYtelser}
          setSelected={setSelectedYtelser}
          options={ytelserOptions}
        />
        <Registreringshjemler
          relevantYtelserkoderverk={relevantKodeverk}
          lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
        />
        <Innsendingshjemler relevantYtelserkoderverk={relevantKodeverk} />
      </BoxNew>
    </VStack>
  );
};
