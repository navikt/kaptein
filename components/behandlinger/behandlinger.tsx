'use client';

import { usePathname } from 'next/navigation';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter, TildelingFilter } from '@/app/custom-parses';
import { LedigeVsTildelte } from '@/components/behandlinger/ledige-vs-tildelte';
import { PåVent } from '@/components/behandlinger/på-vent';
import { SakerPerKlageenhet } from '@/components/behandlinger/saker-per-klageenhet';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { SakerPerYtelseOgKlageenhet } from '@/components/behandlinger/saker-per-ytelse-og-klageenhet';
import { SakerPerYtelse } from '@/components/behandlinger/saker-per-ytelse-og-sakstype';
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
  const [tildelingFilter] = useQueryState('tildeling', parseAsLedigeFilter);
  const pathname = usePathname();

  const showsLedige = tildelingFilter === TildelingFilter.LEDIGE;

  return (
    <div className="grid w-full auto-rows-[768px] grid-cols-1 gap-6 p-6 xl:grid-cols-2 2xl:grid-cols-3">
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
        <LedigeVsTildelte behandlinger={data} total={behandlinger.length} />
      </Card>

      <Card>
        <PåVent behandlinger={data} total={behandlinger.length} />
      </Card>

      <Card>
        <SakerPerKlageenhet behandlinger={data} total={behandlinger.length} klageenheter={klageenheterKodeverk} />
      </Card>

      <Card>
        <SakerPerYtelseOgKlageenhet
          behandlinger={data}
          ytelsekodeverk={ytelseKodeverk}
          klageenheterkodeverk={klageenheterKodeverk}
        />
      </Card>

      {/* <DoubleHeightCard>
        <SakerPerKlageenhetOgYtelse
          behandlinger={data}
          ytelsekodeverk={ytelseKodeverk}
          klageenheterkodeverk={klageenheterKodeverk}
          sakstyperkoderverk={sakstyper}
        />
      </DoubleHeightCard>

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
      </Card> */}
    </div>
  );
};

const useData = (behandlinger: Behandling[]) => {
  const [ytelseFilter] = useQueryState('ytelser', parseAsArrayOf(parseAsString));
  const [klageenheterFilter] = useQueryState('klageenheter', parseAsArrayOf(parseAsString));
  const [hjemlerFilter] = useQueryState('hjemler', parseAsArrayOf(parseAsString));
  const [sakstyperFilter] = useQueryState('sakstyper', parseAsArrayOf(parseAsString));
  const [tildelingFilter] = useQueryState('tildeling', parseAsLedigeFilter);

  const ytelser = ytelseFilter ?? [];
  const klageenheter = klageenheterFilter ?? [];
  const hjemler = hjemlerFilter ?? [];
  const sakstyper = sakstyperFilter ?? [];
  const tildeling = tildelingFilter ?? TildelingFilter.ALL;

  return useMemo(() => {
    const filteredForAnkeITR = behandlinger.filter((b) => b.typeId !== ANKE_I_TRYGDERETTEN_ID);

    const filteredForTildelte =
      tildeling === TildelingFilter.ALL
        ? filteredForAnkeITR
        : filteredForAnkeITR.filter((b) => b.isTildelt === (tildeling === TildelingFilter.TILDELTE));

    const filteredForSakstyper =
      sakstyper.length === 0 ? filteredForTildelte : filteredForTildelte.filter((b) => sakstyper.includes(b.typeId));

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
  }, [behandlinger, ytelser, klageenheter, hjemler, tildeling, sakstyper]);
};

const ANKE_I_TRYGDERETTEN_ID = '3';
