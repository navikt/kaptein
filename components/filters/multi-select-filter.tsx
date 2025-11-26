'use client';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Checkbox, CheckboxGroup, HStack, TextField } from '@navikt/ds-react';
import { useMemo, useState } from 'react';

interface MultiSelectFilterProps {
  label: string;
  selected: string[];
  setSelected: (selected: string[] | null) => void;
  options: { label: string; value: string }[];
  includeNone?: boolean;
}

export const MultiselectFilter = ({ selected, setSelected, options, label }: MultiSelectFilterProps) => {
  const [value, setValue] = useState('');

  const selectedOptions = useMemo(
    () =>
      selected
        .map((id) => options.find((option) => option.value === id))
        .filter((v): v is NonNullable<typeof v> => v !== undefined),
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
          className="justify-between! w-full"
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
        <CheckboxGroup
          legend={label}
          hideLegend
          value={selected ?? []}
          onChange={(values) => setSelected(values.length === 0 ? null : values)}
        >
          {filteredOptions.map((option) => (
            // <Checkbox> renders much faster than <ActionMenu.CheckboxItem>
            <Checkbox size="small" value={option.value} key={option.value}>
              {option.label}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </ActionMenu.Content>
    </ActionMenu>
  );
};
