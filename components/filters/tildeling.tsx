'use client';

import { ToggleGroup } from '@navikt/ds-react';
import { isTildelingFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { useTildelingFilter } from '@/lib/query-state/query-state';

export const Tildeling = () => {
  const [ledige, setLedige] = useTildelingFilter();

  return (
    <ToggleGroup
      label="Tildeling"
      value={ledige}
      onChange={(v) => setLedige(isTildelingFilter(v) ? v : TildelingFilter.ALL)}
    >
      <ToggleGroup.Item value={TildelingFilter.LEDIGE} label="Ledige" />
      <ToggleGroup.Item value={TildelingFilter.TILDELTE} label="Tildelte" />
      <ToggleGroup.Item value={TildelingFilter.ALL} label="Alle" />
    </ToggleGroup>
  );
};
