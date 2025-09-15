'use client';

import { useQueryState } from 'nuqs';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { Alder } from '@/components/behandlinger/alder';
import { AlderPerYtelse } from '@/components/behandlinger/alder-per-ytelse';
import { FristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { FristPerYtelse } from '@/components/behandlinger/frist-per-ytelse';
import { LedigeVsTildelte } from '@/components/behandlinger/ledige-vs-tildelte';
import { SakerPerYtelseOgSakstype } from '@/components/behandlinger/old-saker-per-ytelse-og-sakstype';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { TildelteSakerPåVentIkkePåVent } from '@/components/behandlinger/tildelte-saker-på-vent-ikke-på-vent';
import { useData } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist } from '@/components/behandlinger/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/behandlinger/varslet-frist-per-ytelse';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useBehandlinger, useYtelser } from '@/lib/cache';
import type { IKodeverkSimpleValue, Sakstype } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface CommonProps {
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  klageenheter: IKodeverkSimpleValue[];
}

interface Props extends CommonProps {}

export const Behandlinger = ({ sakstyper, klageenheter }: Props) => {
  const { behandlinger: b } = useBehandlinger();
  const { withTildelteFilter: behandlinger } = useData(b);
  const { ytelser } = useYtelser();
  const [tildelingFilter] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);
  const relevantYtelser = useRelevantYtelser(behandlinger, ytelser);

  const showsLedige = tildelingFilter === TildelingFilter.LEDIGE;
  const showsAlle = tildelingFilter === TildelingFilter.ALL;

  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelseOgSakstype behandlinger={behandlinger} relevantYtelser={relevantYtelser} sakstyper={sakstyper} />
      </Card>

      <Card>
        <SakerPerSakstype behandlinger={behandlinger} sakstyper={sakstyper} />
      </Card>

      {showsAlle ? (
        <Card>
          <LedigeVsTildelte behandlinger={behandlinger} />
        </Card>
      ) : null}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPåVentIkkePåVent behandlinger={behandlinger} />
        </Card>
      )}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPerKlageenhet
            behandlinger={behandlinger}
            klageenheter={klageenheter}
            title="Tildelte saker per klageenhet"
          />
        </Card>
      )}

      {showsLedige ? null : (
        <Card span={3}>
          <TildelteSakerPerYtelseOgKlageenhet
            klageenheterkodeverk={klageenheter}
            relevantYtelser={relevantYtelser}
            title="Tildelte saker per ytelse og klageenhet"
            behandlinger={behandlinger}
          />
        </Card>
      )}

      <Card>
        <VarsletFrist behandlinger={behandlinger} />
      </Card>

      <Card>
        <FristIKabal behandlinger={behandlinger} />
      </Card>

      <Card span={3}>
        <VarsletFristPerYtelse behandlinger={behandlinger} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <FristPerYtelse behandlinger={behandlinger} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <Alder behandlinger={behandlinger} />
      </Card>

      <Card span={4}>
        <AlderPerYtelse behandlinger={behandlinger} relevantYtelser={relevantYtelser} />
      </Card>
    </ChartsWrapper>
  );
};
