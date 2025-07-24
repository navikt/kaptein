'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import type { IKodeverkSimpleValue, Sakstype } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
}

export const Sakstyper = ({ sakstyper }: Props) => {
  const [selected, setSelected] = useQueryState(QueryParam.SAKSTYPER, parseAsArrayOf(parseAsString));

  const options = useMemo(() => sakstyper.map(({ navn, id }) => ({ label: navn, value: id })), [sakstyper]);

  return <MultiselectFilter label="Sakstyper" selected={selected} setSelected={setSelected} options={options} />;
};
