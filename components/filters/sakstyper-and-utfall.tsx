'use client';

import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { SubFilter } from '@/components/filters/sub-filter';
import { useSakstyperFilter, useUtfallFilter } from '@/lib/query-state/query-state';
import type { SakstypeToUtfall } from '@/lib/types';

interface Props {
  sakstyperToUtfall: SakstypeToUtfall[] | undefined;
}

export const SakstyperAndUtfall = ({ sakstyperToUtfall = [] }: Props) => {
  const [selectedSakstyper, setSelectedSakstyper] = useSakstyperFilter();
  const [selectedUtfall, setSelectedUtfall] = useUtfallFilter();

  const sakstyperOptions = useMemo(
    () => sakstyperToUtfall.map(({ navn, id }) => ({ label: navn, value: id })),
    [sakstyperToUtfall],
  );

  const utfallOptions = useMemo(() => {
    const uniqueUtfall: Record<string, string> = {};

    const relevantUtfall =
      selectedSakstyper.length === 0
        ? sakstyperToUtfall.flatMap((u) => u.utfall)
        : sakstyperToUtfall.filter((u) => selectedSakstyper.includes(u.id)).flatMap((u) => u.utfall);

    for (const { id, navn } of relevantUtfall) {
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
