'use client';

import { SakerPerYtelse } from '@/components/behandlinger/saker-per-ytelse-og-sakstype';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';

export const Behandlinger = () => {
  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelse />
      </Card>
    </ChartsWrapper>
  );
};
