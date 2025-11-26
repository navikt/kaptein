'use client';

import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { useSakstyperFilter } from '@/lib/query-state/query-state';
import type { IKodeverkSimpleValue, Sakstype } from '@/lib/types';

interface Props {
  sakstyper: IKodeverkSimpleValue<Sakstype>[] | undefined;
}

export const Sakstyper = ({ sakstyper = [] }: Props) => {
  const [selected, setSelected] = useSakstyperFilter();

  const options = useMemo(() => sakstyper.map(({ navn, id }) => ({ label: navn, value: id })), [sakstyper]);

  return <MultiselectFilter label="Sakstyper" selected={selected} setSelected={setSelected} options={options} />;
};
