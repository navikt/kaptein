'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import type { IKodeverkSimpleValue } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

export const Sakstyper = ({ sakstyper }: { sakstyper: IKodeverkSimpleValue[] }) => {
  const [selected, setSelected] = useQueryState(QueryParam.SAKSTYPER, parseAsArrayOf(parseAsString));
  const options = useMemo(
    () =>
      sakstyper.filter(({ id }) => id !== ANKE_I_TRYGDERETTEN_ID).map(({ navn, id }) => ({ label: navn, value: id })),
    [sakstyper],
  );

  return <MultiselectFilter label="Sakstyper" selected={selected} setSelected={setSelected} options={options} />;
};

const ANKE_I_TRYGDERETTEN_ID = '3';
