'use client';

import { BodyShort, HelpText, HStack, Label, List, ToggleGroup } from '@navikt/ds-react';
import { ListItem } from '@navikt/ds-react/List';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { isTilbakekrevingFilter, parseAsTilbakekrevingFilter } from '@/app/custom-query-parsers';
import { TilbakekrevingFilter } from '@/app/query-types';
import { QueryParam } from '@/lib/types/query-param';
import { TILBAKEKREVINGINNSENDINGSHJEMLER } from '@/lib/types/tilbakekrevingshjemler';

interface Props {
  help: React.ReactNode;
}

export const Tilbakekreving = ({ help }: Props) => {
  const [tilbakekreving, setTilbakekreving] = useQueryState(QueryParam.TILBAKEKREVING, parseAsTilbakekrevingFilter);

  return (
    <ToggleGroup
      value={tilbakekreving ?? TilbakekrevingFilter.MED}
      onChange={(v) => setTilbakekreving(isTilbakekrevingFilter(v) ? v : TilbakekrevingFilter.MED)}
      label={help}
    >
      <ToggleGroup.Item value={TilbakekrevingFilter.MED}>Med tilbakekreving</ToggleGroup.Item>
      <ToggleGroup.Item value={TilbakekrevingFilter.UTEN}>Uten tilbakekreving</ToggleGroup.Item>
      <ToggleGroup.Item value={TilbakekrevingFilter.KUN}>Kun tilbakekreving</ToggleGroup.Item>
    </ToggleGroup>
  );
};

export const HelpForFerdigstilte = () => (
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

interface HelpForAktiveProps {
  innsendingshjemlerMap: Record<string, string>;
}

export const HelpForAktive = ({ innsendingshjemlerMap }: HelpForAktiveProps) => {
  const listItems = useMemo(
    () =>
      TILBAKEKREVINGINNSENDINGSHJEMLER.map((id) => ({ id, label: innsendingshjemlerMap[id] ?? id }))
        .toSorted((a, b) => a.label.localeCompare(b.label))
        .map(({ id, label }) => <ListItem key={id}>{label}</ListItem>),
    [innsendingshjemlerMap],
  );

  return (
    <HStack gap="2">
      Tilbakekreving
      <HelpText placement="right">
        <BodyShort>
          Sak satt med minst én av følgende innsendingshjemler regnes som aktiv tilbakekrevingssak i Kaptein:
        </BodyShort>
        <List>{listItems}</List>
      </HelpText>
    </HStack>
  );
};
