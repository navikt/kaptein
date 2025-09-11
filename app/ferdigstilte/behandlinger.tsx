'use client';

import { FristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { FristPerYtelse } from '@/components/behandlinger/frist-per-ytelse';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { useData } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist } from '@/components/behandlinger/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/behandlinger/varslet-frist-per-ytelse';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { debugBehandlinger } from '@/components/debug';
import { Alder } from '@/components/graphs/alder/graph';
import { AlderPerYtelse } from '@/components/graphs/alder-per-ytelse/graph';
import { SakerPerYtelse } from '@/components/graphs/saker-per-ytelse-og-sakstype/graph';
import { browserLog } from '@/lib/browser-log';
import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  ytelseKodeverk: IYtelse[];
  klageenheterKodeverk: IKodeverkSimpleValue[];
}

export const Behandlinger = ({ behandlinger, sakstyper, ytelseKodeverk, klageenheterKodeverk }: Props) => {
  const relevantYtelser = useRelevantYtelser(behandlinger, ytelseKodeverk);

  const { withTildelteFilter: data } = useData(behandlinger);

  debugBehandlinger(behandlinger);
  browserLog.debug('Data', data);

  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelse finished />
      </Card>

      <Card>
        <SakerPerSakstype behandlinger={data} sakstyper={sakstyper} />
      </Card>

      <Card span={3}>
        <TildelteSakerPerKlageenhet
          behandlinger={data}
          klageenheter={klageenheterKodeverk}
          title="Saker per klageenhet"
        />
      </Card>

      <Card span={3}>
        <TildelteSakerPerYtelseOgKlageenhet
          title="Saker per ytelse og klageenhet"
          behandlinger={data}
          relevantYtelser={relevantYtelser}
          klageenheterkodeverk={klageenheterKodeverk}
        />
      </Card>

      <Card>
        <VarsletFrist behandlinger={data} />
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
