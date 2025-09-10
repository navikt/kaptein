'use client';

import { BodyShort, HelpText, HStack, Label, ToggleGroup } from '@navikt/ds-react';
import { usePathname } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { isTilbakekrevingFilter, parseAsTilbakekrevingFilter } from '@/app/custom-query-parsers';
import { TilbakekrevingFilter } from '@/app/query-types';
import { QueryParam } from '@/lib/types/query-param';

export const Tilbakekreving = () => {
  const [tilbakekreving, setTilbakekreving] = useQueryState(QueryParam.TILBAKEKREVING, parseAsTilbakekrevingFilter);
  const pathname = usePathname();

  return (
    <ToggleGroup
      value={tilbakekreving ?? TilbakekrevingFilter.MED}
      onChange={(v) => setTilbakekreving(isTilbakekrevingFilter(v) ? v : TilbakekrevingFilter.MED)}
      label={pathname === '/ferdigstilte' ? <HelpForFerdigstilte /> : 'Tilbakekreving'}
    >
      <ToggleGroup.Item value={TilbakekrevingFilter.MED}>Med tilbakekreving</ToggleGroup.Item>
      <ToggleGroup.Item value={TilbakekrevingFilter.UTEN}>Uten tilbakekreving</ToggleGroup.Item>
      <ToggleGroup.Item value={TilbakekrevingFilter.KUN}>Kun tilbakekreving</ToggleGroup.Item>
    </ToggleGroup>
  );
};

const HelpForFerdigstilte = () => (
  <HStack gap="2">
    Tilbakekreving
    <HelpText placement="right">
      <Label>Med tilbakekreving</Label>
      <BodyShort spacing>Vis alle saker, også saker som er registrert som tilbakekrevingssak.</BodyShort>
      <Label>Uten tilbakekreving</Label>
      <BodyShort spacing>Vis alle saker, uten de som er registrert som tilbakekrevingssak.</BodyShort>
      <Label>Kun tilbakekreving</Label>
      <BodyShort spacing>Vis kun saker som er registrert som tilbakekrevingssak.</BodyShort>
    </HelpText>
  </HStack>
);
