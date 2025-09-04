'use client';

import { ToggleGroup } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { isLedigeFilter, parseAsLedigeFilter, TildeltFilter } from '@/app/custom-parses';

export const Tildeling = () => {
  const [ledige, setLedige] = useQueryState('ledige', parseAsLedigeFilter);

  return (
    <ToggleGroup
      label="Tildeling"
      value={ledige ?? TildeltFilter.ALL}
      onChange={(v) => {
        setLedige(isLedigeFilter(v) ? v : TildeltFilter.ALL);
      }}
    >
      <ToggleGroup.Item value={TildeltFilter.LEDIGE}>Ledige</ToggleGroup.Item>
      <ToggleGroup.Item value={TildeltFilter.TILDELTE}>Tildelte</ToggleGroup.Item>
      <ToggleGroup.Item value={TildeltFilter.ALL}>Alle</ToggleGroup.Item>
    </ToggleGroup>
  );
};
