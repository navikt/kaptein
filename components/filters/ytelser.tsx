'use client';

import { UNSAFE_Combobox } from '@navikt/ds-react';
import { useSearchParams } from 'next/navigation';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';
import type { IYtelse } from '@/lib/server/types';

export const Ytelser = ({ ytelser: ytelserList }: { ytelser: IYtelse[] }) => {
  const [ytelser, setYtelser] = useQueryState('ytelser', parseAsArrayOf(parseAsString));

  const options = useMemo(() => ytelserList.map((ytelse) => ({ label: ytelse.navn, value: ytelse.id })), [ytelserList]);
  const searchParams = useSearchParams();
  const selected = useMemo(
    () =>
      (searchParams.get('ytelser')?.split(',') || [])
        .map((id) => options.find((option) => option.value === id))
        .filter((v): v is NonNullable<typeof v> => Boolean(v)),
    [options, searchParams],
  );
  const [value, setValue] = useState('');

  const filteredOptions = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(value.toLowerCase())),
    [options, value],
  );

  return (
    <UNSAFE_Combobox
      filteredOptions={filteredOptions}
      value={value}
      label="Ytelser"
      isMultiSelect
      onChange={setValue}
      selectedOptions={selected}
      options={options}
      onToggleSelected={(option, isSelected) => {
        const selectedYtelser = ytelser ?? [];

        return isSelected
          ? setYtelser([...selectedYtelser, option])
          : setYtelser(selectedYtelser.filter((id) => id !== option));
      }}
    />
  );
};
