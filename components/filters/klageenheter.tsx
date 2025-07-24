'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import type { IKodeverkSimpleValue } from '@/lib/server/types';

export const Klageenheter = ({ klageenheter }: { klageenheter: IKodeverkSimpleValue[] }) => {
  const [selected, setSelected] = useQueryState('klageenheter', parseAsArrayOf(parseAsString));

  const options = useMemo(() => klageenheter.map(({ navn, id }) => ({ label: navn, value: id })), [klageenheter]);

  return <MultiselectFilter label="Klageenheter" selected={selected} setSelected={setSelected} options={options} />;
};
