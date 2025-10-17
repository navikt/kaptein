'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import type { IKodeverkSimpleValue, Utfall } from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  utfall: IKodeverkSimpleValue<Utfall>[];
}

export const UtfallFilter = ({ utfall }: Props) => {
  const [selectedUtfall, setSelectedUtfall] = useQueryState(QueryParam.UTFALL, parseAsArrayOf(parseAsString));

  const utfallOptions = useMemo(
    () => utfall.map(({ id, navn }) => ({ label: navn, value: id })).toSorted((a, b) => a.label.localeCompare(b.label)),
    [utfall],
  );

  return (
    <MultiselectFilter
      label="Utfall"
      selected={selectedUtfall}
      setSelected={setSelectedUtfall}
      options={utfallOptions}
    />
  );
};
