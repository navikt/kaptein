'use client';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, HStack, TextField, VStack } from '@navikt/ds-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo, useState } from 'react';
import { HjemlerMode } from '@/components/filters/ytelser-and-hjemler/hjemler-mode';
import { sortWithOrdinals } from '@/lib/sort-with-ordinals/sort-with-ordinals';
import type { IKodeverkSimpleValue, IYtelse } from '@/lib/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  relevantYtelser: IYtelse[];
  lovkildeToRegistreringshjemler: IKodeverkSimpleValue[];
}

export const Registreringshjemler = ({ relevantYtelser, lovkildeToRegistreringshjemler }: Props) => {
  const [selectedHjemler, setSelectedHjemler] = useQueryState(
    QueryParam.REGISTRERINGSHJEMLER,
    parseAsArrayOf(parseAsString),
  );

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
        hjemlerMap,
      }))
      .toSorted((a, b) => sortWithOrdinals(a.lovkildeLabel, b.lovkildeLabel))
      .map(({ lovkildeId, lovkildeLabel, hjemlerMap }) => ({
        lovkildeLabel,
        lovkildeId,
        hjemler: Array.from(hjemlerMap.entries())
          .toSorted(([, a], [, b]) => sortWithOrdinals(a, b))
          .map(([value, label]) => ({ label, value })),
      }));
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
        <ActionMenu.Group key={lovkildeId} label={label}>
          {hjemler.map(({ label: hjemmelLabel, value: hjemmelId }) => (
            <ActionMenu.CheckboxItem
              key={lovkildeId + hjemmelId}
              checked={selectedOptions.some((o) => o === hjemmelId)}
              onCheckedChange={(checked) => {
                setSelectedHjemler(
                  checked
                    ? [...(selectedHjemler || []), hjemmelId]
                    : (selectedHjemler || []).filter((selectedId) => hjemmelId !== selectedId),
                );
              }}
            >
              {hjemmelLabel}
            </ActionMenu.CheckboxItem>
          ))}
        </ActionMenu.Group>
      )),
    [filteredOptions, selectedOptions, selectedHjemler, setSelectedHjemler],
  );

  const all = useMemo(() => options.flatMap(({ hjemler }) => hjemler.map(({ value }) => value)), [options]);

  return (
    <VStack gap="1" className="grow">
      <HjemlerMode queryParam={QueryParam.REGISTRERINGSHJEMLER_MODE} />
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button
            variant="secondary-neutral"
            icon={<ChevronDownIcon aria-hidden />}
            iconPosition="right"
            className="!justify-between grow"
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

          {filteredItems}
        </ActionMenu.Content>
      </ActionMenu>
    </VStack>
  );
};
