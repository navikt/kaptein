'use client';

import { ToggleGroup } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { isTilbakekrevingFilter, parseAsTilbakekrevingFilter, TilbakekrevingFilter } from '@/app/custom-parsers';

export const Tilbakekreving = () => {
  const [tilbakekreving, setTilbakekreving] = useQueryState('tilbakekreving', parseAsTilbakekrevingFilter);

  return (
    <ToggleGroup
      label="Tilbakekreving"
      value={tilbakekreving ?? TilbakekrevingFilter.MED}
      onChange={(v) => setTilbakekreving(isTilbakekrevingFilter(v) ? v : TilbakekrevingFilter.MED)}
    >
      <ToggleGroup.Item value={TilbakekrevingFilter.MED}>Med tilbakekreving</ToggleGroup.Item>
      <ToggleGroup.Item value={TilbakekrevingFilter.UTEN}>Uten tilbakekreving</ToggleGroup.Item>
      <ToggleGroup.Item value={TilbakekrevingFilter.KUN}>Kun tilbakekreving</ToggleGroup.Item>
    </ToggleGroup>
  );
};
