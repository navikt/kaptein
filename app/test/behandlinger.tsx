'use client';

import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { SakerPerYtelse } from '@/components/graphs/saker-per-ytelse-og-sakstype/graph';

export const Behandlinger = () => {
  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelse finished />
      </Card>
    </ChartsWrapper>
  );
};
