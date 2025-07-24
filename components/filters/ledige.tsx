'use client';

import { ToggleGroup } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { isLedigeFilter, LedigeFilter, parseAsLedigeFilter } from '@/app/custom-parses';

export const Ledige = () => {
  const [ledige, setLedige] = useQueryState('ledige', parseAsLedigeFilter);

  return (
    <ToggleGroup
      label="Tildeling (fake data)"
      value={ledige ?? LedigeFilter.ALL}
      onChange={(v) => {
        setLedige(isLedigeFilter(v) ? v : LedigeFilter.ALL);
      }}
    >
      <ToggleGroup.Item value={LedigeFilter.LEDIGE}>Ledige</ToggleGroup.Item>
      <ToggleGroup.Item value={LedigeFilter.TILDELTE}>Tildelte</ToggleGroup.Item>
      <ToggleGroup.Item value={LedigeFilter.ALL}>Alle</ToggleGroup.Item>
    </ToggleGroup>
  );
};
