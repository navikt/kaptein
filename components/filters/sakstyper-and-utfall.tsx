'use client';

import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { SubFilter } from '@/components/filters/sub-filter';
import {
  useKaSakstyperFilter,
  useKaUtfallFilter,
  useTrSakstyperFilter,
  useTrUtfallFilter,
} from '@/lib/query-state/query-state';
import type { SakstypeToUtfall } from '@/lib/types';

interface Props {
  sakstyperToUtfall: SakstypeToUtfall[] | undefined;
}

export const KaSakstyperAndUtfall = ({ sakstyperToUtfall = [] }: Props) => {
  const [selectedSakstyper, setSelectedSakstyper] = useKaSakstyperFilter();
  const [selectedUtfall, setSelectedUtfall] = useKaUtfallFilter();

  return (
    <Filter
      sakstyperToUtfall={sakstyperToUtfall}
      selectedUtfall={selectedUtfall}
      setSelectedUtfall={setSelectedUtfall}
      selectedSakstyper={selectedSakstyper}
      setSelectedSakstyper={setSelectedSakstyper}
    />
  );
};

export const TrSakstyperAndUtfall = ({ sakstyperToUtfall = [] }: Props) => {
  const [selectedSakstyper, setSelectedSakstyper] = useTrSakstyperFilter();
  const [selectedUtfall, setSelectedUtfall] = useTrUtfallFilter();

  return (
    <Filter
      sakstyperToUtfall={sakstyperToUtfall}
      selectedUtfall={selectedUtfall}
      setSelectedUtfall={setSelectedUtfall}
      selectedSakstyper={selectedSakstyper}
      setSelectedSakstyper={setSelectedSakstyper}
    />
  );
};

interface FilterProps extends Props {
  sakstyperToUtfall: SakstypeToUtfall[];
  selectedSakstyper: string[];
  setSelectedSakstyper: (sakstyper: string[] | null) => void;
  selectedUtfall: string[];
  setSelectedUtfall: (utfall: string[] | null) => void;
}

const Filter = ({
  sakstyperToUtfall = [],
  selectedUtfall,
  setSelectedUtfall,
  selectedSakstyper,
  setSelectedSakstyper,
}: FilterProps) => {
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
