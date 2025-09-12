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

const CUSTOM = 'custom';

export const DayPicker = ({ value, setValue, title, options }: Props) => {
  const [toggleGroupValue, setToggleGroupValue] = useState<string | undefined>(value?.toString() ?? undefined);
  const [textFieldValue, setTextFieldValue] = useState((7 * 12).toString());

  useEffect(() => {
    const timeout = setTimeout(() => {
      const num = Number.parseInt(textFieldValue, 10);

      if (!Number.isNaN(num)) {
        setValue(num);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [textFieldValue, setValue]);

  useEffect(() => {
    if (toggleGroupValue !== CUSTOM && value != null && value.toString() !== textFieldValue) {
      setTextFieldValue(value.toString());
    }
  }, [value, textFieldValue, toggleGroupValue]);

  return (
    <HStack gap="4">
      <ToggleGroup
        label={title}
        className="self-end"
        value={toggleGroupValue}
        onChange={(v) => {
          setToggleGroupValue(v);

          if (v === CUSTOM) {
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
        disabled={toggleGroupValue !== CUSTOM}
        label="Dager"
      />
    </HStack>
  );
};
