'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import type { IKodeverkSimpleValue } from '@/lib/server/types';

export const Utfall = ({ utfall }: { utfall: IKodeverkSimpleValue[] }) => {
  const [selected, setSelected] = useQueryState('utfall', parseAsArrayOf(parseAsString));
  const options = useMemo(() => utfall.map(({ navn, id }) => ({ label: navn, value: id })), [utfall]);

  return <MultiselectFilter label="Utfall" selected={selected} setSelected={setSelected} options={options} />;
};
