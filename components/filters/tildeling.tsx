'use client';

import { ToggleGroup } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { isLedigeFilter, parseAsLedigeFilter, TildelingFilter } from '@/app/custom-parsers';

export const Tildeling = () => {
  const [ledige, setLedige] = useQueryState('tildeling', parseAsLedigeFilter);

  return (
    <ToggleGroup
      label="Tildeling"
      value={ledige ?? TildelingFilter.ALL}
      onChange={(v) => setLedige(isLedigeFilter(v) ? v : TildelingFilter.ALL)}
    >
      <ToggleGroup.Item value={TildelingFilter.LEDIGE}>Ledige</ToggleGroup.Item>
      <ToggleGroup.Item value={TildelingFilter.TILDELTE}>Tildelte</ToggleGroup.Item>
      <ToggleGroup.Item value={TildelingFilter.ALL}>Alle</ToggleGroup.Item>
    </ToggleGroup>
  );
};
