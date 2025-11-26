'use client';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Checkbox, CheckboxGroup, HStack, TextField, VStack } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { RegistreringshjemlerMode } from '@/components/filters/ytelser-and-hjemler/hjemler-mode';
import { useRegistreringshjemlerFilter } from '@/lib/query-state/query-state';
import { sortWithOrdinals } from '@/lib/sort-with-ordinals/sort-with-ordinals';
import type { IKodeverkSimpleValue, IYtelse } from '@/lib/types';

interface Props {
  relevantYtelser: IYtelse[];
  lovkildeToRegistreringshjemler: IKodeverkSimpleValue[];
}

export const Registreringshjemler = ({ relevantYtelser, lovkildeToRegistreringshjemler }: Props) => {
  const [selectedHjemler, setSelectedHjemler] = useRegistreringshjemlerFilter();

  const [value, setValue] = useState('');

  const options = useMemo(() => {
    const hjemler: Map<string, Map<string, string>> = new Map();

    // Create map with unique entries
    for (const ytelse of relevantYtelser) {
      for (const { registreringshjemler, lovkilde } of ytelse.lovKildeToRegistreringshjemler) {
        for (const hjemmel of registreringshjemler) {
          const existing = hjemler.get(lovkilde.id);

          if (existing === undefined) {
            hjemler.set(lovkilde.id, new Map().set(hjemmel.id, hjemmel.navn));
          } else {
            existing.set(hjemmel.id, hjemmel.navn);
          }
        }
      }
    }

    // Create (iterable) array and sort
    return Array.from(hjemler.entries())
      .map(([lovkildeId, hjemlerMap]) => ({
        lovkildeId,
        lovkildeLabel: lovkildeToRegistreringshjemler.find((l) => l.id === lovkildeId)?.navn ?? lovkildeId,
        hjemler: Array.from(hjemlerMap.entries())
          .toSorted(([, a], [, b]) => sortWithOrdinals(a, b))
          .map(([value, label]) => ({ label, value })),
      }))
      .toSorted((a, b) => sortWithOrdinals(a.lovkildeLabel, b.lovkildeLabel));
  }, [relevantYtelser, lovkildeToRegistreringshjemler]);

  const selectedOptions = selectedHjemler ?? [];

  const filteredOptions = useMemo(() => {
    let isFilteredByHjemmel = false;

    const filteredByHjemmel = options
      .map(({ hjemler, ...rest }) => ({
        ...rest,
        hjemler: hjemler.filter(({ label }) => {
          const filtered = label.toLowerCase().includes(value.toLowerCase());

          if (filtered) {
            isFilteredByHjemmel = true;
          }

          return filtered;
        }),
      }))
      .filter(({ hjemler }) => hjemler.length > 0);

    if (isFilteredByHjemmel) {
      return filteredByHjemmel;
    }

    // Filter by lovkilde instead
    return options.filter((option) => option.lovkildeLabel.toLowerCase().includes(value.toLowerCase()));
  }, [options, value]);

  const filteredItems = useMemo(
    () =>
      filteredOptions.map(({ lovkildeLabel: label, lovkildeId, hjemler }) => (
        <CheckboxGroup
          key={lovkildeId}
          legend={label}
          value={selectedOptions}
          onChange={(values) => setSelectedHjemler(values.length === 0 ? null : values)}
        >
          {hjemler.map(({ label: hjemmelLabel, value: hjemmelId }) => (
            // <Checkbox> renders much faster than <ActionMenu.CheckboxItem>
            <Checkbox size="small" value={hjemmelId}>
              {hjemmelLabel}
            </Checkbox>
          ))}
        </CheckboxGroup>
      )),
    [filteredOptions, selectedOptions, setSelectedHjemler],
  );

  const all = useMemo(() => options.flatMap(({ hjemler }) => hjemler.map(({ value }) => value)), [options]);

  return (
    <VStack gap="1" className="grow">
      <RegistreringshjemlerMode />
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button
            variant="secondary-neutral"
            icon={<ChevronDownIcon aria-hidden />}
            iconPosition="right"
            className="justify-between! grow"
          >
            Registreringshjemler ({selectedOptions.length})
          </Button>
        </ActionMenu.Trigger>

        <ActionMenu.Content className="relative">
          <HStack wrap={false} className="sticky top-0 z-1 bg-ax-bg-default">
            <TextField
              autoFocus
              className="grow"
              placeholder="Filtrer"
              label="Registreringshjemler"
              hideLabel
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <Button onClick={() => setSelectedHjemler(all)} size="small" variant="secondary" style={{ marginLeft: 8 }}>
              Velg alle
            </Button>

            <Button onClick={() => setSelectedHjemler(null)} size="small" variant="danger" style={{ marginLeft: 8 }}>
              Fjern alle
            </Button>
          </HStack>

          <ActionMenu.Divider />

          <VStack gap="4">{filteredItems}</VStack>
        </ActionMenu.Content>
      </ActionMenu>
    </VStack>
  );
};
