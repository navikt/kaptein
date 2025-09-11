'use client';

import { FristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { FristPerYtelse } from '@/components/behandlinger/frist-per-ytelse';
import { SakerPerYtelseOgSakstype as OldSakerPerYtelseOgSakstype } from '@/components/behandlinger/old-saker-per-ytelse-og-sakstype';
import { SakerPerSakstype as OldSakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { TildelteSakerPerKlageenhet as OldTildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet as OldTildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { useData } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist as OldVarsletFrist } from '@/components/behandlinger/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/behandlinger/varslet-frist-per-ytelse';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { debugBehandlinger } from '@/components/debug';
import { Alder } from '@/components/graphs/alder/graph';
import { AlderPerYtelse } from '@/components/graphs/alder-per-ytelse/graph';
import { SakerPerSakstype } from '@/components/graphs/saker-per-sakstype/graph';
import { SakerPerYtelseOgSakstype } from '@/components/graphs/saker-per-ytelse-og-sakstype/graph';
import { TildelteSakerPerKlageenhet } from '@/components/graphs/tildelte-saker-per-klageenhet/graph';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/graphs/tildelte-saker-per-ytelse-og-klageenhet/graph';
import { VarsletFrist } from '@/components/graphs/varslet-frist/graph';
import { browserLog } from '@/lib/browser-log';
import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  ytelseKodeverk: IYtelse[];
  klageenheterKodeverk: IKodeverkSimpleValue[];
}

export const Behandlinger = ({ behandlinger, ytelseKodeverk, klageenheterKodeverk, sakstyper }: Props) => {
  console.log('behandlinger UI', behandlinger.length);
  const relevantYtelser = useRelevantYtelser(behandlinger, ytelseKodeverk);

  const { withTildelteFilter: data } = useData(behandlinger);

  debugBehandlinger(behandlinger);
  browserLog.debug('Data', data);

  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelseOgSakstype finished tildelt />
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
        <FristIKabal behandlinger={data} />
      </Card>

      <Card span={3}>
        <VarsletFristPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <FristPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <Alder />
      </Card>

      <Card span={4}>
        <AlderPerYtelse />
      </Card>
    </ChartsWrapper>
  );
};
