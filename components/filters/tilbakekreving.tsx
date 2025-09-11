'use client';

import { BodyShort, HelpText, HStack, Label, List, ToggleGroup } from '@navikt/ds-react';
import { ListItem } from '@navikt/ds-react/List';
import { usePathname } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { isTilbakekrevingFilter, parseAsTilbakekrevingFilter } from '@/app/custom-query-parsers';
import { TilbakekrevingFilter } from '@/app/query-types';
import { QueryParam } from '@/lib/types/query-param';

export const Tilbakekreving = () => {
  const [tilbakekreving, setTilbakekreving] = useQueryState(QueryParam.TILBAKEKREVING, parseAsTilbakekrevingFilter);
  const pathname = usePathname();

  const label = useMemo(() => {
    switch (pathname) {
      case '/ferdigstilte':
        return <HelpForFerdigstilte />;
      case '/aktive':
        return <HelpForAktive />;
      default:
        return 'Tilbakekreving';
    }
  }, [pathname]);

  return (
    <ToggleGroup
      value={tilbakekreving ?? TilbakekrevingFilter.MED}
      onChange={(v) => setTilbakekreving(isTilbakekrevingFilter(v) ? v : TilbakekrevingFilter.MED)}
      label={label}
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

const HelpForAktive = () => (
  <HStack gap="2">
    Tilbakekreving
    <HelpText placement="right">
      <BodyShort>
        Sak satt med minst én av følgende innsendingshjemler regnes som aktiv tilbakekrevingssak i Kaptein:
        <List>
          <ListItem>folketrygdloven 22-15</ListItem>
          <ListItem>folketrygdloven 22-15 dødsbo</ListItem>
          <ListItem>alle andre varianter av folketrygdloven 22-15</ListItem>
          <ListItem>folketrygdloven 22-17a</ListItem>
          <ListItem>folketrygdloven 4-28</ListItem>
          <ListItem>barnetrygdloven § 13</ListItem>
          <ListItem>kontantstøtteloven § 11</ListItem>
          <ListItem>lov om supplerende stønad § 13</ListItem>
        </List>
      </BodyShort>
    </HelpText>
  </HStack>
);
