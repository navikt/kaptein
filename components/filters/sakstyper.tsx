'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import type { IKodeverkSimpleValue } from '@/lib/server/types';

export const Sakstyper = ({ sakstyper }: { sakstyper: IKodeverkSimpleValue[] }) => {
  const [selected, setSelected] = useQueryState('sakstyper', parseAsArrayOf(parseAsString));
  const options = useMemo(() => sakstyper.map(({ navn, id }) => ({ label: navn, value: id })), [sakstyper]);

  return <MultiselectFilter label="Sakstyper" selected={selected} setSelected={setSelected} options={options} />;
};
