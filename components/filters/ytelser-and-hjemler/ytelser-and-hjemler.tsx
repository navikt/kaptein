'use client';

import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { SubFilter } from '@/components/filters/sub-filter';
import { Innsendingshjemler } from '@/components/filters/ytelser-and-hjemler/innsendingshjemler';
import { Registreringshjemler } from '@/components/filters/ytelser-and-hjemler/registreringshjemler';
import { Ytelsesgrupper } from '@/components/filters/ytelsesgrupper';
import {
  useInnsendingshjemlerFilter,
  useRegistreringshjemlerFilter,
  useYtelserFilter,
} from '@/lib/query-state/query-state';
import type { IKodeverkValue, IYtelse } from '@/lib/types';

interface Props {
  ytelser: IYtelse[] | undefined;
  lovkildeToRegistreringshjemler: IKodeverkValue[] | undefined;
}

const useYtelserAndHjemler = (ytelser: IYtelse[]) => {
  const [selectedYtelser, setSelectedYtelser] = useYtelserFilter();

  const ytelserOptions = useMemo(() => ytelser.map(({ navn, id }) => ({ label: navn, value: id })), [ytelser]);
  const relevantKodeverk = useMemo(
    () => (selectedYtelser.length === 0 ? ytelser : ytelser.filter((y) => selectedYtelser.includes(y.id))),
    [selectedYtelser, ytelser],
  );

  return { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk };
};

export const YtelserAndRegistreringshjemler = ({ ytelser = [], lovkildeToRegistreringshjemler = [] }: Props) => {
  const { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk } = useYtelserAndHjemler(ytelser);
  const [, setSelectedHjemler] = useRegistreringshjemlerFilter();

  return (
    <>
      <Ytelsesgrupper />

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

export const YtelserAndInnsendingshjemler = ({ ytelser = [] }: { ytelser: IYtelse[] | undefined }) => {
  const { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk } = useYtelserAndHjemler(ytelser);
  const [, setSelectedHjemler] = useInnsendingshjemlerFilter();

  return (
    <>
      <Ytelsesgrupper />

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

export const YtelserAndInnsendingsAndRegistreringshjemler = ({
  ytelser = [],
  lovkildeToRegistreringshjemler = [],
}: Props) => {
  const { selectedYtelser, setSelectedYtelser, ytelserOptions, relevantKodeverk } = useYtelserAndHjemler(ytelser);
  const [, setSelectedInnsendingsHjemler] = useInnsendingshjemlerFilter();
  const [, setSelectedRegistreringsHjemler] = useRegistreringshjemlerFilter();

  return (
    <>
      <Ytelsesgrupper />

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
