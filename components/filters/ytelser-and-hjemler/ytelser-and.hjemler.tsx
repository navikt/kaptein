'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { SubFilter } from '@/components/filters/sub-filter';
import { Innsendingshjemler } from '@/components/filters/ytelser-and-hjemler/innsendingshjemler';
import { Registreringshjemler } from '@/components/filters/ytelser-and-hjemler/registreringshjemler';
import type { IKodeverkValue, IYtelse } from '@/lib/types';
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

      <SubFilter>
        <Registreringshjemler
          relevantYtelser={relevantKodeverk}
          lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
        />
      </SubFilter>
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

      <SubFilter>
        <Innsendingshjemler relevantYtelser={relevantKodeverk} />
      </SubFilter>
    </>
  );
};

export const YtelserAndInnsendingsAndRegistreringshjemler = ({ ytelser, lovkildeToRegistreringshjemler }: Props) => {
  const { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk } = useYtelserAndHjemler(ytelser);
  const [, setSelectedInnsendingsHjemler] = useQueryState(QueryParam.INNSENDINGSHJEMLER, parseAsArrayOf(parseAsString));
  const [, setSelectedRegistreringsHjemler] = useQueryState(
    QueryParam.REGISTRERINGSHJEMLER,
    parseAsArrayOf(parseAsString),
  );

  return (
    <>
      <MultiselectFilter
        label="Ytelser"
        selected={selectedYtelser}
        setSelected={(v) => {
          setSelectedYtelser(v);
          setSelectedInnsendingsHjemler(null);
          setSelectedRegistreringsHjemler(null);
        }}
        options={ytelserOptions}
      />

      <SubFilter>
        <Innsendingshjemler relevantYtelser={relevantKodeverk} />
      </SubFilter>

      <SubFilter>
        <Registreringshjemler
          relevantYtelser={relevantKodeverk}
          lovkildeToRegistreringshjemler={lovkildeToRegistreringshjemler}
        />
      </SubFilter>
    </>
  );
};
