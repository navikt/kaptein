'use client';

import { AlderPerYtelse } from '@/components/behandlinger/alder-per-ytelse';
import { FristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { OverskredetVarsletFrist } from '@/components/behandlinger/overskredet-varslet-frist';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { SakerPerYtelse } from '@/components/behandlinger/saker-per-ytelse-og-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { useData } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist } from '@/components/behandlinger/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/behandlinger/varslet-frist-per-ytelse';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { debugBehandlinger } from '@/components/debug';
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
  console.log('Data', data);

  return (
    <ChartsWrapper>
      <Card>
        <SakerPerYtelse
          behandlinger={data}
          total={behandlinger.length}
          relevantYtelser={relevantYtelser}
          sakstyper={sakstyper}
        />
      </Card>

      <Card>
        <SakerPerSakstype behandlinger={data} sakstyper={sakstyper} total={behandlinger.length} />
      </Card>

      <Card>
        <TildelteSakerPerKlageenhet
          behandlinger={data}
          total={behandlinger.length}
          klageenheter={klageenheterKodeverk}
        />
      </Card>

      <Card>
        <TildelteSakerPerYtelseOgKlageenhet
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

      <Card>
        <VarsletFristPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>

      <Card>
        <OverskredetVarsletFrist behandlinger={data} />
      </Card>

      <Card>
        <AlderPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>
    </ChartsWrapper>
  );
};
