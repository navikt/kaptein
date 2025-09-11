'use client';

import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { SakerPerYtelseOgSakstype } from '@/components/graphs/saker-per-ytelse-og-sakstype/graph';

export const Behandlinger = () => {
  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelseOgSakstype finished />
      </Card>
    </ChartsWrapper>
  );
};
