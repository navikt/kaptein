'use client';

import { ToggleGroup } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { isLedigeFilter, parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { QueryParam } from '@/lib/types/query-param';

export const Tildeling = () => {
  const [ledige, setLedige] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);

  useEffect(() => {
    if (ledige === null) {
      setLedige(TildelingFilter.ALL);
    }
  }, [setLedige, ledige]);

  return (
    <ToggleGroup
      label="Tildeling"
      value={ledige ?? undefined}
      onChange={(v) => setLedige(isLedigeFilter(v) ? v : TildelingFilter.ALL)}
    >
      <ToggleGroup.Item value={TildelingFilter.LEDIGE}>Ledige</ToggleGroup.Item>
      <ToggleGroup.Item value={TildelingFilter.TILDELTE}>Tildelte</ToggleGroup.Item>
      <ToggleGroup.Item value={TildelingFilter.ALL}>Alle</ToggleGroup.Item>
    </ToggleGroup>
  );
};
