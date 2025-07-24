'use client';

import { HStack } from '@navikt/ds-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { AntallAktiveSaker } from '@/app/behandlinger/antall-aktive-saker';
import { PåVent } from '@/app/behandlinger/på-vent';
import { Card } from '@/components/cards';
import type { Behandling, IKodeverkSimpleValue, IKodeverkValue, IYtelse } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue[];
  ytelseKodeverk: IYtelse[];
  påVentReasons: IKodeverkValue[];
}

export const Behandlinger = ({ behandlinger, sakstyper, ytelseKodeverk, påVentReasons }: Props) => {
  const [ytelseFilter] = useQueryState('ytelser', parseAsArrayOf(parseAsString));
  const [klageenheterFilter] = useQueryState('klageenheter', parseAsArrayOf(parseAsString));

  const ytelser = ytelseFilter ?? [];
  const klageenheter = klageenheterFilter ?? [];

  const filtered = useMemo(() => {
    const filteredForYtelser =
      ytelser.length === 0 ? behandlinger : behandlinger.filter((b) => ytelser.includes(b.ytelseId));
    const filteredForKlageenheter =
      klageenheter.length === 0
        ? filteredForYtelser
        : filteredForYtelser.filter((b) => klageenheter.includes(b.fraNAVEnhet));

    return filteredForKlageenheter;
  }, [behandlinger, ytelser, klageenheter]);

  return (
    <HStack gap="8" wrap className="w-full" padding="8">
      <Card>
        <AntallAktiveSaker behandlinger={filtered} sakstyper={sakstyper} total={behandlinger.length} />
      </Card>
      <Card>
        <PåVent
          behandlinger={filtered}
          total={behandlinger.length}
          ytelsekodeverk={ytelseKodeverk}
          påVentReasons={påVentReasons}
        />
      </Card>
    </HStack>
  );
};
