'use client';

import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import { useKlageenheterFilter } from '@/lib/query-state/query-state';
import type { IKodeverkSimpleValue } from '@/lib/types';

export const Klageenheter = ({ klageenheter = [] }: { klageenheter: IKodeverkSimpleValue[] | undefined }) => {
  const [selected, setSelected] = useKlageenheterFilter();

  const options = useMemo(() => klageenheter.map(({ navn, id }) => ({ label: navn, value: id })), [klageenheter]);

  return <MultiselectFilter label="Klageenheter" selected={selected} setSelected={setSelected} options={options} />;
};
