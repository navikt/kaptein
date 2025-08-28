'use client';

import { UNSAFE_Combobox } from '@navikt/ds-react';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { IYtelse } from '@/lib/server/types';

export const Ytelser = ({ ytelser, onChange }: { ytelser: IYtelse[]; onChange: (value: string[]) => void }) => {
  const options = useMemo(() => ytelser.map((ytelse) => ({ label: ytelse.navn, value: ytelse.id })), [ytelser]);
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
      onToggleSelected={(option, isSelected) =>
        isSelected
          ? onChange([...selected.map((s) => s.value), option])
          : onChange(selected.map((s) => s.value).filter((id) => id !== option))
      }
    />
  );
};
