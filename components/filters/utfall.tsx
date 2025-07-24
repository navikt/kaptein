'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import type { IKodeverkSimpleValue } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

export const Utfall = ({ utfall }: { utfall: IKodeverkSimpleValue[] }) => {
  const [selected, setSelected] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));
  const options = useMemo(() => utfall.map(({ navn, id }) => ({ label: navn, value: id })), [utfall]);

  return <MultiselectFilter label="Utfall" selected={selected} setSelected={setSelected} options={options} />;
};
