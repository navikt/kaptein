'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { MultiselectFilter } from '@/components/filters/multi-select-filter';
import type { IYtelse } from '@/lib/server/types';

export const Ytelser = ({ ytelser }: { ytelser: IYtelse[] }) => {
  const [selected, setSelected] = useQueryState('ytelser', parseAsArrayOf(parseAsString));

  const options = useMemo(() => ytelser.map(({ navn, id }) => ({ label: navn, value: id })), [ytelser]);

  return <MultiselectFilter label="Ytelser" selected={selected} setSelected={setSelected} options={options} />;
};
