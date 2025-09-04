'use client';

import { HStack } from '@navikt/ds-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { LedigeFilter, parseAsLedigeFilter } from '@/app/custom-parses';
import { LedigeVsTildelte } from '@/components/behandlinger/ledige-vs-tildelte';
import { PåVent } from '@/components/behandlinger/på-vent';
import { PåVentPerYtelse } from '@/components/behandlinger/på-vent-per-ytelse';
import { SakerPerKlageenhet } from '@/components/behandlinger/saker-per-klageenhet';
import { SakerPerKlageenhetOgYtelse } from '@/components/behandlinger/saker-per-klageenhet-og-ytelse';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { SakerPerYtelse } from '@/components/behandlinger/saker-per-ytelse';
import { SakerPerYtelseHosKlageenhet } from '@/components/behandlinger/saker-per-ytelse-hos-klageenhet';
import { SakerPerYtelseOgKlageenhet } from '@/components/behandlinger/saker-per-ytelse-og-klageenhet';
import { Card, DoubleHeightCard } from '@/components/cards';
import type { Behandling, IKodeverkSimpleValue, IKodeverkValue, IYtelse } from '@/lib/server/types';

interface Props {
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue[];
  ytelseKodeverk: IYtelse[];
  påVentReasons: IKodeverkValue[];
  klageenheterKodeverk: IKodeverkSimpleValue[];
}

export const Behandlinger = ({
  behandlinger,
  sakstyper,
  ytelseKodeverk,
  påVentReasons,
  klageenheterKodeverk,
}: Props) => {
  const data = useData(behandlinger);

  return (
    <HStack gap="8" wrap className="h-fit" padding="6">
      <DoubleHeightCard>
        <SakerPerKlageenhetOgYtelse
          behandlinger={data}
          ytelsekodeverk={ytelseKodeverk}
          klageenheterkodeverk={klageenheterKodeverk}
          sakstyperkoderverk={sakstyper}
        />
      </DoubleHeightCard>
      <Card>
        <SakerPerYtelseOgKlageenhet
          behandlinger={data}
          ytelsekodeverk={ytelseKodeverk}
          klageenheterkodeverk={klageenheterKodeverk}
        />
      </Card>

      <Card>
        <SakerPerSakstype behandlinger={data} sakstyper={sakstyper} total={behandlinger.length} />
      </Card>

      <Card>
        <LedigeVsTildelte behandlinger={data} total={behandlinger.length} />
      </Card>

      <Card>
        <PåVent behandlinger={data} total={behandlinger.length} />
      </Card>

      <Card>
        <SakerPerYtelseHosKlageenhet
          behandlinger={data}
          total={behandlinger.length}
          ytelser={ytelseKodeverk}
          klageenheter={klageenheterKodeverk}
        />
      </Card>

      <Card>
        <PåVentPerYtelse
          behandlinger={data}
          total={behandlinger.length}
          ytelsekodeverk={ytelseKodeverk}
          påVentReasons={påVentReasons}
        />
      </Card>

      <Card>
        <SakerPerKlageenhet behandlinger={data} total={behandlinger.length} klageenheter={klageenheterKodeverk} />
      </Card>

      <Card>
        <SakerPerYtelse behandlinger={data} total={behandlinger.length} ytelser={ytelseKodeverk} />
      </Card>
    </HStack>
  );
};

const useData = (behandlinger: Behandling[]) => {
  const [ytelseFilter] = useQueryState('ytelser', parseAsArrayOf(parseAsString));
  const [klageenheterFilter] = useQueryState('klageenheter', parseAsArrayOf(parseAsString));
  const [hjemlerFilter] = useQueryState('hjemler', parseAsArrayOf(parseAsString));
  const [sakstyperFilter] = useQueryState('sakstyper', parseAsArrayOf(parseAsString));
  const [ledigeFilter] = useQueryState('ledige', parseAsLedigeFilter);

  const ytelser = ytelseFilter ?? [];
  const klageenheter = klageenheterFilter ?? [];
  const hjemler = hjemlerFilter ?? [];
  const sakstyper = sakstyperFilter ?? [];
  const ledige = ledigeFilter ?? LedigeFilter.ALL;

  return useMemo(() => {
    const filteredForAnkeITR = behandlinger.filter((b) => b.typeId !== ANKE_I_TRYGDERETTEN_ID);

    const filteredForLedige =
      ledige === LedigeFilter.ALL
        ? filteredForAnkeITR
        : filteredForAnkeITR.filter((b) => b.isTildelt === (ledige === LedigeFilter.LEDIGE));

    const filteredForSakstyper =
      sakstyper.length === 0 ? filteredForLedige : filteredForLedige.filter((b) => sakstyper.includes(b.typeId));

    const filteredForYtelser =
      ytelser.length === 0 ? filteredForSakstyper : filteredForSakstyper.filter((b) => ytelser.includes(b.ytelseId));

    const filteredForKlageenheter =
      klageenheter.length === 0
        ? filteredForYtelser
        : filteredForYtelser.filter((b) => klageenheter.includes(b.fraNAVEnhet));

    const filteredForHjemler =
      hjemler.length === 0
        ? filteredForKlageenheter
        : filteredForKlageenheter.filter((b) => hjemler.some((h) => b.resultat.hjemmelIdSet.includes(h)));

    return filteredForHjemler;
  }, [behandlinger, ytelser, klageenheter, hjemler, ledige, sakstyper]);
};

const ANKE_I_TRYGDERETTEN_ID = '3';
