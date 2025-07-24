'use client';

import { ToggleGroup } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { ActiveFilter, isActiveFilter, parseAsActiveFilter } from '@/app/custom-parses';

export const Avsluttet = () => {
  const [avsluttet, setAvsluttet] = useQueryState('avsluttet', parseAsActiveFilter);

  return (
    <ToggleGroup
      label="Status"
      value={avsluttet ?? ActiveFilter.ALL}
      onChange={(v) => {
        setAvsluttet(isActiveFilter(v) ? v : ActiveFilter.ALL);
      }}
    >
      <ToggleGroup.Item value={ActiveFilter.ACTIVE}>Aktive</ToggleGroup.Item>
      <ToggleGroup.Item value={ActiveFilter.FINISHED}>Ferdigstilte</ToggleGroup.Item>
      <ToggleGroup.Item value={ActiveFilter.ALL}>Alle</ToggleGroup.Item>
    </ToggleGroup>
  );
};
