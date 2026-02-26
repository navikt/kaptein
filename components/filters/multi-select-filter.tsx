'use client';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Checkbox, CheckboxGroup, HStack, InlineMessage, TextField } from '@navikt/ds-react';
import { useMemo, useState } from 'react';

interface MultiSelectFilterProps<T extends string> {
  label: string;
  selected: T[];
  setSelected: (selected: T[] | null) => void;
  options: { label: string; value: T }[];
  includeNone?: boolean;
}

export const MultiselectFilter = <T extends string>({
  selected,
  setSelected,
  options,
  label,
}: MultiSelectFilterProps<T>) => {
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
          variant="secondary"
          data-color="neutral"
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

          <Button
            onClick={() => setSelected(null)}
            size="small"
            variant="primary"
            data-color="danger"
            style={{ marginLeft: 8 }}
          >
            Fjern alle
          </Button>
        </HStack>

        <ActionMenu.Divider />
        {filteredOptions.length === 0 ? (
          <InlineMessage status="info">Ingen {label.toLowerCase()}</InlineMessage>
        ) : (
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
        )}
      </ActionMenu.Content>
    </ActionMenu>
  );
};
