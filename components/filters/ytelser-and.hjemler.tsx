'use client';

import { BoxNew } from '@navikt/ds-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import type { IYtelse } from '@/lib/server/types';

export const YtelserAndHjemler = ({ ytelser }: { ytelser: IYtelse[] }) => {
  const [selectedYtelser, setSelectedYtelser] = useQueryState('ytelser', parseAsArrayOf(parseAsString));
  const [selectedHjemler, setSelectedHjemler] = useQueryState('hjemler', parseAsArrayOf(parseAsString));

  const ytelserOptions = useMemo(() => ytelser.map(({ navn, id }) => ({ label: navn, value: id })), [ytelser]);

  const hjemlerOptions = useMemo(() => {
    const ytelseList =
      selectedYtelser === null || selectedYtelser.length === 0
        ? ytelser
        : ytelser.filter((y) => selectedYtelser.includes(y.id));

    const hjemler: Record<string, { value: string; label: string }> = {};

    for (const ytelse of ytelseList) {
      for (const { registreringshjemler } of ytelse.lovKildeToRegistreringshjemler) {
        for (const hjemmel of registreringshjemler) {
          hjemler[hjemmel.id] = { value: hjemmel.id, label: hjemmel.navn };
        }
      }
    }

    return Object.values(hjemler);
  }, [ytelser, selectedYtelser]);

  return (
    <BoxNew
      background="neutral-moderate"
      padding="3"
      borderRadius="medium"
      borderColor="neutral-subtle"
      borderWidth="1"
    >
      <MultiselectFilter
        label="Ytelser"
        selected={selectedYtelser}
        setSelected={setSelectedYtelser}
        options={ytelserOptions}
      />
      <MultiselectFilter
        label="Hjemler"
        selected={selectedHjemler}
        setSelected={setSelectedHjemler}
        options={hjemlerOptions}
      />
    </BoxNew>
  );
};
