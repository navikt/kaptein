'use client';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, HStack, TextField } from '@navikt/ds-react';
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

  const all = useMemo(() => options.map((option) => option.value), [options]);

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          variant="secondary-neutral"
          icon={<ChevronDownIcon aria-hidden />}
          iconPosition="right"
          className="!justify-between"
        >
          {label} ({selectedOptions.length})
        </Button>
      </ActionMenu.Trigger>

      <ActionMenu.Content className="relative">
        <HStack wrap={false} className="sticky top-0 z-1 bg-ax-bg-default">
          <TextField
            autoFocus
            className="grow"
            placeholder="Filtrer"
            label={label}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            hideLabel
          />

          <Button onClick={() => setSelected(all)} size="small" variant="secondary" style={{ marginLeft: 8 }}>
            Velg alle
          </Button>

          <Button onClick={() => setSelected(null)} size="small" variant="danger" style={{ marginLeft: 8 }}>
            Fjern alle
          </Button>
        </HStack>

        <ActionMenu.Divider />

        <ActionMenu.Group label={label}>
          {filteredOptions.map((option) => (
            <ActionMenu.CheckboxItem
              key={option.value}
              checked={selectedOptions.some((o) => o.value === option.value)}
              onCheckedChange={(checked) => {
                setSelected(
                  checked ? [...(selected || []), option.value] : (selected || []).filter((id) => id !== option.value),
                );
              }}
            >
              {option.label}
            </ActionMenu.CheckboxItem>
          ))}
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  );
};
