'use client';

import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { useUtfallFilter } from '@/lib/query-state/query-state';
import type { IKodeverkSimpleValue, Utfall } from '@/lib/types';

interface Props {
  utfall: IKodeverkSimpleValue<Utfall>[];
}

export const UtfallFilter = ({ utfall }: Props) => {
  const [selectedUtfall, setSelectedUtfall] = useUtfallFilter();

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
