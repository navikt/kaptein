'use client';

import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { SakerPerYtelse } from '@/components/behandlinger/saker-per-ytelse-og-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { useData } from '@/components/behandlinger/use-data';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import type { Behandling, IKodeverkSimpleValue, IYtelse } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue[];
  ytelseKodeverk: IYtelse[];
  klageenheterKodeverk: IKodeverkSimpleValue[];
}

export const Behandlinger = ({ behandlinger, sakstyper, ytelseKodeverk, klageenheterKodeverk }: Props) => {
  const { withTildelteFilter: data } = useData(behandlinger);

  return (
    <ChartsWrapper>
      <Card>
        <SakerPerYtelse
          behandlinger={data}
          total={behandlinger.length}
          ytelser={ytelseKodeverk}
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
          ytelsekodeverk={ytelseKodeverk}
          klageenheterkodeverk={klageenheterKodeverk}
        />
      </Card>
    </ChartsWrapper>
  );
};
