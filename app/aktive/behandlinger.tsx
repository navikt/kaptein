'use client';

import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter, TildelingFilter } from '@/app/custom-query-parsers';
import { LedigeVsTildelte } from '@/components/behandlinger/ledige-vs-tildelte';
import { OverVarsletFrist } from '@/components/behandlinger/over-varslet-frist';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { SakerPerYtelse } from '@/components/behandlinger/saker-per-ytelse-og-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { TildelteSakerPåVentIkkePåVent } from '@/components/behandlinger/tildelte-saker-på-vent-ikke-på-vent';
import { useData } from '@/components/behandlinger/use-data';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  ytelseKodeverk: IYtelse[];
  klageenheterKodeverk: IKodeverkSimpleValue[];
}

export const Behandlinger = ({ behandlinger, sakstyper, ytelseKodeverk, klageenheterKodeverk }: Props) => {
  const aktive = useMemo(() => behandlinger.filter((b) => b.avsluttetAvSaksbehandlerDate === null), [behandlinger]);
  const { withTildelteFilter: data, withoutTildelteFilter } = useData(aktive);
  const [tildelingFilter] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);
  const showsTildelte = tildelingFilter === TildelingFilter.TILDELTE;
  const showsLedige = tildelingFilter === TildelingFilter.LEDIGE;
  const showsAlle = tildelingFilter === TildelingFilter.ALL;

  const tildelte = useMemo(() => withoutTildelteFilter.filter((b) => b.isTildelt), [withoutTildelteFilter]);

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

      {showsAlle ? (
        <Card>
          <LedigeVsTildelte behandlinger={data} />
        </Card>
      ) : null}

      {showsTildelte ? (
        <Card>
          <TildelteSakerPåVentIkkePåVent behandlinger={data} total={behandlinger.length} />
        </Card>
      ) : null}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPerKlageenhet
            behandlinger={tildelte}
            total={behandlinger.length}
            klageenheter={klageenheterKodeverk}
          />
        </Card>
      )}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPerYtelseOgKlageenhet
            behandlinger={tildelte}
            ytelsekodeverk={ytelseKodeverk}
            klageenheterkodeverk={klageenheterKodeverk}
          />
        </Card>
      )}

      <Card>
        <OverVarsletFrist behandlinger={data} />
      </Card>
    </ChartsWrapper>
  );
};
