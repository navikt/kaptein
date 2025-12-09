'use client';

import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { useKaSakstyperFilter, useTrSakstyperFilter } from '@/lib/query-state/query-state';
import type { IKodeverkSimpleValue, Sakstype } from '@/lib/types';

interface Props {
  sakstyper: IKodeverkSimpleValue<Sakstype>[] | undefined;
}

export const KaSakstyper = ({ sakstyper = [] }: Props) => {
  const [selected, setSelected] = useKaSakstyperFilter();

  return <Filter sakstyper={sakstyper} selected={selected} setSelected={setSelected} />;
};

export const TrSakstyper = ({ sakstyper = [] }: Props) => {
  const [selected, setSelected] = useTrSakstyperFilter();

  return <Filter sakstyper={sakstyper} selected={selected} setSelected={setSelected} />;
};

interface FilterProps {
  selected: string[];
  setSelected: (sakstyper: string[] | null) => void;
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
}

const Filter = ({ selected, setSelected, sakstyper }: FilterProps) => {
  const options = useMemo(() => sakstyper.map(({ navn, id }) => ({ label: navn, value: id })), [sakstyper]);

  return <MultiselectFilter label="Sakstyper" selected={selected} setSelected={setSelected} options={options} />;
};
