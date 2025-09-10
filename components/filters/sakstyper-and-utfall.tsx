'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { SubFilter } from '@/components/filters/sub-filter';
import { ANKE_I_TRYGDERETTEN_ID, type SakstypeToUtfall } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  sakstyperToUtfall: SakstypeToUtfall[];
}

export const SakstyperAndUtfall = ({ sakstyperToUtfall }: Props) => {
  const [selectedSakstyper, setSelectedSakstyper] = useQueryState(QueryParam.SAKSTYPER, parseAsArrayOf(parseAsString));
  const [selectedUtfall, setSelectedUtfall] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));

  const sakstyperOptions = useMemo(
    () =>
      sakstyperToUtfall
        .filter(({ id }) => id !== ANKE_I_TRYGDERETTEN_ID)
        .map(({ navn, id }) => ({ label: navn, value: id })),
    [sakstyperToUtfall],
  );

  const utfallOptions = useMemo(() => {
    const uniqueUtfall: Record<string, string> = {};

    const allUtfall = sakstyperToUtfall
      .filter((u) => selectedSakstyper === null || selectedSakstyper.length === 0 || selectedSakstyper.includes(u.id))
      .flatMap((u) => u.utfall);

    for (const { id, navn } of allUtfall) {
      uniqueUtfall[id] = navn;
    }

    return Object.entries(uniqueUtfall)
      .map(([value, label]) => ({ label, value }))
      .toSorted((a, b) => a.label.localeCompare(b.label));
  }, [sakstyperToUtfall, selectedSakstyper]);

  return (
    <>
      <MultiselectFilter
        label="Sakstyper"
        selected={selectedSakstyper}
        setSelected={(v) => {
          setSelectedSakstyper(v);
          setSelectedUtfall(null);
        }}
        options={sakstyperOptions}
      />
      <SubFilter>
        <MultiselectFilter
          label="Utfall"
          selected={selectedUtfall}
          setSelected={setSelectedUtfall}
          options={utfallOptions}
        />
      </SubFilter>
    </>
  );
};
