'use client';

import { HStack, TextField, ToggleGroup } from '@navikt/ds-react';
import { useEffect, useState } from 'react';

interface Option {
  numDays: number;
  label: string;
}

interface Props {
  value: number | null;
  setValue: (value: number | null) => void;
  title: string;
  options: Option[];
}

export const DayPicker = ({ value, setValue, title, options }: Props) => {
  const isWeeks = value !== null && value % 7 === 0;
  const [toggleGroupValue, setToggleGroupValue] = useState(isWeeks ? String(value / 7) : 'custom');
  const [textFieldValue, setTextFieldValue] = useState((7 * 12).toString());

  useEffect(() => {
    const timeout = setTimeout(() => {
      const num = Number.parseInt(textFieldValue, 10);

      if (!Number.isNaN(num)) {
        setValue(num);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [textFieldValue, setValue]);

  return (
    <HStack gap="4">
      <ToggleGroup
        label={title}
        className="self-end"
        value={toggleGroupValue}
        onChange={(v) => {
          setToggleGroupValue(v);

          if (v === 'custom') {
            const num = Number.parseInt(textFieldValue, 10);

            if (!Number.isNaN(num)) {
              setValue(num);
            }

            return;
          }

          const num = Number.parseInt(v, 10);

          if (!Number.isNaN(num)) {
            setValue(num);
            setTextFieldValue(num.toString());
          }
        }}
      >
        {options.map(({ numDays, label }) => (
          <ToggleGroup.Item key={numDays} value={String(numDays)}>
            {label}
          </ToggleGroup.Item>
        ))}
        <ToggleGroup.Item value="custom">Egendefinert</ToggleGroup.Item>
      </ToggleGroup>

      <TextField
        className="w-20"
        type="number"
        value={textFieldValue}
        onChange={({ target }) => setTextFieldValue(target.value)}
        disabled={toggleGroupValue !== 'custom'}
        label="Dager"
      />
    </HStack>
  );
};
