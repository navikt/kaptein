'use client';

import { UNSAFE_Combobox } from '@navikt/ds-react';
import { useMemo, useState } from 'react';

interface MultiSelectFilterProps {
  label: string;
  selected: string[] | null;
  setSelected: (selected: string[] | null) => void;
  options: { label: string; value: string }[];
  includeNone?: boolean;
}

export const MultiselectFilter = ({ selected, setSelected, options, label }: MultiSelectFilterProps) => {
  const [value, setValue] = useState('');

  const selectedOptions = useMemo(
    () =>
      (selected || [])
        .map((id) => options.find((option) => option.value === id))
        .filter((v): v is NonNullable<typeof v> => Boolean(v)),
    [options, selected],
  );

  const filteredOptions = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(value.toLowerCase())),
    [options, value],
  );

  return (
    <UNSAFE_Combobox
      filteredOptions={filteredOptions}
      value={value}
      label={label}
      isMultiSelect
      onChange={setValue}
      selectedOptions={selectedOptions}
      options={options}
      onToggleSelected={(option, isSelected) => {
        if (!isSelected && (selected === null || selected.length === 0)) {
          setSelected(null);
        }

        const selectedValues = selected ?? [];

        return isSelected
          ? setSelected([...selectedValues, option])
          : setSelected(selectedValues.filter((id) => id !== option));
      }}
    />
  );
};
