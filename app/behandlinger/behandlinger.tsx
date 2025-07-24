'use client';

import { HStack } from '@navikt/ds-react';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { PåVent } from '@/app/behandlinger/på-vent';
import { SakerPerKlageenhet } from '@/app/behandlinger/saker-per-klageenhet';
import { SakerPerSakstype } from '@/app/behandlinger/saker-per-sakstype';
import { SakerPerYtelse } from '@/app/behandlinger/saker-per-ytelse';
import { SakerPerYtelseHosKlageenhet } from '@/app/behandlinger/saker-per-ytelse-hos-klageenhet';
import { ActiveFilter, LedigeFilter, parseAsActiveFilter, parseAsLedigeFilter } from '@/app/custom-parses';
import { Card } from '@/components/cards';
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
      <Card>
        <SakerPerSakstype behandlinger={data} sakstyper={sakstyper} total={behandlinger.length} />
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
        <PåVent
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
  const [avsluttetFilter] = useQueryState('avsluttet', parseAsActiveFilter);
  const [ledigeFilter] = useQueryState('ledige', parseAsLedigeFilter);

  const ytelser = ytelseFilter ?? [];
  const klageenheter = klageenheterFilter ?? [];
  const hjemler = hjemlerFilter ?? [];
  const avsluttet = avsluttetFilter ?? ActiveFilter.ALL;
  const ledige = ledigeFilter ?? LedigeFilter.ALL;

  return useMemo(() => {
    // TODO: Filter for tildeltSaksbehandler when field is availble from BE
    const filteredForLedige =
      ledige === LedigeFilter.ALL
        ? behandlinger
        : behandlinger.filter((b) => b.tilbakekreving === (ledige === LedigeFilter.LEDIGE));

    const filteredForAvsluttet =
      avsluttet === ActiveFilter.ALL
        ? filteredForLedige
        : filteredForLedige.filter((b) => b.isAvsluttetAvSaksbehandler === (avsluttet === ActiveFilter.FINISHED));

    const filteredForYtelser =
      ytelser.length === 0 ? filteredForAvsluttet : filteredForAvsluttet.filter((b) => ytelser.includes(b.ytelseId));

    const filteredForKlageenheter =
      klageenheter.length === 0
        ? filteredForYtelser
        : filteredForYtelser.filter((b) => klageenheter.includes(b.fraNAVEnhet));

    const filteredForHjemler =
      hjemler.length === 0
        ? filteredForKlageenheter
        : filteredForKlageenheter.filter((b) => hjemler.some((h) => b.resultat.hjemmelIdSet.includes(h)));

    return filteredForHjemler;
  }, [behandlinger, ytelser, klageenheter, hjemler, avsluttet, ledige]);
};
