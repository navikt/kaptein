'use client';

import { useMemo } from 'react';
import { FristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { SakerPerYtelse } from '@/components/behandlinger/saker-per-ytelse-og-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { useData } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist } from '@/components/behandlinger/varslet-frist';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  ytelseKodeverk: IYtelse[];
  klageenheterKodeverk: IKodeverkSimpleValue[];
}

export const Behandlinger = ({ behandlinger, sakstyper, ytelseKodeverk, klageenheterKodeverk }: Props) => {
  const ferdigstilte = useMemo(
    () => behandlinger.filter((b) => b.avsluttetAvSaksbehandlerDate !== null),
    [behandlinger],
  );
  const relevantYtelser = useRelevantYtelser(behandlinger, ytelseKodeverk);

  const { withTildelteFilter: data } = useData(ferdigstilte);

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
    </ChartsWrapper>
  );
};
