'use client';

import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { Alder } from '@/components/graphs/alder/graph';
import { AlderPerYtelse } from '@/components/graphs/alder-per-ytelse/graph';
import { FristIKabal } from '@/components/graphs/frist-i-kabal/graph';
import { FristPerYtelse } from '@/components/graphs/frist-per-ytelse/graph';
import { SakerPerSakstype } from '@/components/graphs/saker-per-sakstype/graph';
import { SakerPerYtelseOgSakstype } from '@/components/graphs/saker-per-ytelse-og-sakstype/graph';
import { TildelteSakerPerKlageenhet } from '@/components/graphs/tildelte-saker-per-klageenhet/graph';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/graphs/tildelte-saker-per-ytelse-og-klageenhet/graph';
import { VarsletFrist } from '@/components/graphs/varslet-frist/graph';
import { VarsletFristPerYtelse } from '@/components/graphs/varslet-frist-per-ytelse/graph';

export const Behandlinger = () => {
  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelseOgSakstype finished />
      </Card>

      <Card>
        <SakerPerSakstype finished />
      </Card>

      <Card span={3}>
        <TildelteSakerPerKlageenhet title="Saker per klageenhet" finished />
      </Card>

      <Card span={3}>
        <TildelteSakerPerYtelseOgKlageenhet title="Saker per ytelse og klageenhet" finished />
      </Card>

      <Card>
        <VarsletFrist finished />
      </Card>

      <Card>
        <FristIKabal finished />
      </Card>

      <Card span={3}>
        <VarsletFristPerYtelse finished />
      </Card>

      <Card span={3}>
        <FristPerYtelse finished />
      </Card>

      <Card span={3}>
        <Alder finished />
      </Card>

      <Card span={4}>
        <AlderPerYtelse finished />
      </Card>
    </ChartsWrapper>
  );
};
