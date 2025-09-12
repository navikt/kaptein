'use client';

import { Alder as OldAlder } from '@/components/behandlinger/alder';
import { AlderPerYtelse as OldAlderPerYtelse } from '@/components/behandlinger/alder-per-ytelse';
import { FristIKabal as OldFristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { FristPerYtelse as OldFristPerYtelse } from '@/components/behandlinger/frist-per-ytelse';
import { SakerPerYtelseOgSakstype as OldSakerPerYtelseOgSakstype } from '@/components/behandlinger/old-saker-per-ytelse-og-sakstype';
import { SakerPerSakstype as OldSakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { TildelteSakerPerKlageenhet as OldTildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet as OldTildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { useData } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist as OldVarsletFrist } from '@/components/behandlinger/varslet-frist';
import { VarsletFristPerYtelse as OldVarsletFristPerYtelse } from '@/components/behandlinger/varslet-frist-per-ytelse';
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
import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  ytelseKodeverk: IYtelse[];
  klageenheterKodeverk: IKodeverkSimpleValue[];
}

export const Behandlinger = ({ behandlinger, ytelseKodeverk, klageenheterKodeverk, sakstyper }: Props) => {
  const { withTildelteFilter: data } = useData(behandlinger);
  const relevantYtelser = useRelevantYtelser(data, ytelseKodeverk);

  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelseOgSakstype finished />
      </Card>

      {/* TODO: Remove */}
      <Card span={3}>
        <OldSakerPerYtelseOgSakstype behandlinger={data} relevantYtelser={relevantYtelser} sakstyper={sakstyper} />
      </Card>

      <Card>
        <SakerPerSakstype finished />
      </Card>

      {/* TODO: Remove */}
      <Card>
        <OldSakerPerSakstype behandlinger={data} sakstyper={sakstyper} />
      </Card>

      <Card span={3}>
        <TildelteSakerPerKlageenhet title="Saker per klageenhet" finished />
      </Card>

      {/* TODO: Remove */}
      <Card span={3}>
        <OldTildelteSakerPerKlageenhet
          title="Saker per klageenhet"
          behandlinger={data}
          klageenheter={klageenheterKodeverk}
        />
      </Card>

      <Card span={3}>
        <TildelteSakerPerYtelseOgKlageenhet title="Saker per ytelse og klageenhet" finished />
      </Card>

      {/* TODO: Remove */}
      <Card span={3}>
        <OldTildelteSakerPerYtelseOgKlageenhet
          title="Saker per ytelse og klageenhet"
          behandlinger={data}
          klageenheterkodeverk={klageenheterKodeverk}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card>
        <VarsletFrist finished />
      </Card>

      {/* TODO: Remove */}
      <Card>
        <OldVarsletFrist behandlinger={data} />
      </Card>

      <Card>
        <FristIKabal finished />
      </Card>

      {/* TODO: Remove */}
      <Card>
        <OldFristIKabal behandlinger={data} />
      </Card>

      <Card span={3}>
        <VarsletFristPerYtelse finished />
      </Card>

      {/* TODO: Remove */}
      <Card span={3}>
        <OldVarsletFristPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <FristPerYtelse finished />
      </Card>

      {/* TODO: Remove */}
      <Card span={3}>
        <OldFristPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <Alder finished />
      </Card>

      {/* TODO: Remove */}
      <Card span={3}>
        <OldAlder behandlinger={data} />
      </Card>

      <Card span={4}>
        <AlderPerYtelse finished />
      </Card>

      {/* TODO: Remove */}
      <Card span={4}>
        <OldAlderPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>
    </ChartsWrapper>
  );
};
