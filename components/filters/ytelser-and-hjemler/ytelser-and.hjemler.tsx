'use client';

import { ChevronRightIcon } from '@navikt/aksel-icons';
import { HStack } from '@navikt/ds-react';
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

const useYtelserAndHjemler = (ytelser: IYtelse[]) => {
  const [selectedYtelser, setSelectedYtelser] = useQueryState(QueryParam.YTELSER, parseAsArrayOf(parseAsString));

  const ytelserOptions = useMemo(() => ytelser.map(({ navn, id }) => ({ label: navn, value: id })), [ytelser]);
  const relevantKodeverk = useMemo(
    () =>
      selectedYtelser === null || selectedYtelser.length === 0
        ? ytelser
        : ytelser.filter((y) => selectedYtelser.includes(y.id)),
    [selectedYtelser, ytelser],
  );

  return { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk };
};

const Tabbed = ({ children }: { children: React.ReactNode }) => (
  <HStack align="center" className="flex">
    <ChevronRightIcon fontSize={32} aria-hidden />
    {children}
  </HStack>
);

export const YtelserAndRegistreringshjemler = ({ ytelser, lovkildeToRegistreringshjemler }: Props) => {
  const { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk } = useYtelserAndHjemler(ytelser);
  const [, setSelectedHjemler] = useQueryState(QueryParam.REGISTRERINGSHJEMLER, parseAsArrayOf(parseAsString));

  return (
    <>
      <MultiselectFilter
        label="Ytelser"
        selected={selectedYtelser}
        setSelected={(v) => {
          setSelectedYtelser(v);
          setSelectedHjemler(null);
        }}
        options={ytelserOptions}
      />

      <Tabbed>
        <Registreringshjemler
          relevantYtelserkoderverk={relevantKodeverk}
          lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
        />
      </Tabbed>
    </>
  );
};

export const YtelserAndInnsendingshjemler = ({ ytelser }: { ytelser: IYtelse[] }) => {
  const { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk } = useYtelserAndHjemler(ytelser);
  const [, setSelectedHjemler] = useQueryState(QueryParam.INNSENDINGSHJEMLER, parseAsArrayOf(parseAsString));

  return (
    <>
      <MultiselectFilter
        label="Ytelser"
        selected={selectedYtelser}
        setSelected={(v) => {
          setSelectedYtelser(v);
          setSelectedHjemler(null);
        }}
        options={ytelserOptions}
      />

      <Tabbed>
        <Innsendingshjemler relevantYtelserkoderverk={relevantKodeverk} />
      </Tabbed>
    </>
  );
};
