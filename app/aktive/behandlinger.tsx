'use client';

import { Loader, VStack } from '@navikt/ds-react';
import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { Alder } from '@/components/behandlinger/alder';
import { AlderPerYtelse } from '@/components/behandlinger/alder-per-ytelse';
import { FristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { FristPerYtelse } from '@/components/behandlinger/frist-per-ytelse';
import { LedigeVsTildelte } from '@/components/behandlinger/ledige-vs-tildelte';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { SakerPerYtelseOgSakstype } from '@/components/behandlinger/saker-per-ytelse-og-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { TildelteSakerPåVentIkkePåVent } from '@/components/behandlinger/tildelte-saker-på-vent-ikke-på-vent';
import { useAktive } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist } from '@/components/behandlinger/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/behandlinger/varslet-frist-per-ytelse';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { useClientFetch } from '@/lib/client/use-client-fetch';
import type { IKodeverkSimpleValue, IYtelse, LedigBehandling, Sakstype, TildeltBehandling } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  ledige: LedigBehandling[];
  tildelte: TildeltBehandling[];
}

interface KodeverkProps {
  ytelser: IYtelse[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  klageenheter: IKodeverkSimpleValue[];
}

export const Behandlinger = (kodeverk: KodeverkProps) => {
  const ledige = useClientFetch<LedigBehandling[]>('/api/behandlinger/ledige');
  const tildelte = useClientFetch<TildeltBehandling[]>('/api/behandlinger/tildelte');

  if (ledige === null || tildelte === null) {
    return (
      <VStack align="center" justify="center" className="w-full">
        <Loader size="3xlarge" />
      </VStack>
    );
  }

  return <BehandlingerData ledige={ledige} tildelte={tildelte} {...kodeverk} />;
};
const BehandlingerData = ({ ledige, tildelte, sakstyper, ytelser, klageenheter }: Props & KodeverkProps) => {
  const [tildelingFilter] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);
  const showsLedige = tildelingFilter === TildelingFilter.LEDIGE;
  const showsAlle = tildelingFilter === TildelingFilter.ALL;

  const behandlinger = useMemo(() => {
    if (tildelingFilter === TildelingFilter.LEDIGE) {
      return ledige;
    }

    if (tildelingFilter === TildelingFilter.TILDELTE) {
      return tildelte;
    }

    return [...ledige, ...tildelte];
  }, [tildelingFilter, ledige, tildelte]);

  const filteredBehandlinger = useAktive(behandlinger);
  const relevantYtelser = useRelevantYtelser(filteredBehandlinger, ytelser);

  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelseOgSakstype
          behandlinger={filteredBehandlinger}
          sakstyper={sakstyper}
          relevantYtelser={relevantYtelser}
        />
      </Card>

      <Card>
        <SakerPerSakstype behandlinger={filteredBehandlinger} sakstyper={sakstyper} />
      </Card>

      {showsAlle ? (
        <Card>
          <LedigeVsTildelte behandlinger={filteredBehandlinger} />
        </Card>
      ) : null}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPåVentIkkePåVent behandlinger={filteredBehandlinger} />
        </Card>
      )}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPerKlageenhet
            behandlinger={filteredBehandlinger}
            klageenheter={klageenheter}
            title="Tildelte saker per klageenhet"
          />
        </Card>
      )}

      {showsLedige ? null : (
        <Card span={3}>
          <TildelteSakerPerYtelseOgKlageenhet
            title="Tildelte saker per ytelse og klageenhet"
            behandlinger={filteredBehandlinger}
            klageenheter={klageenheter}
            relevantYtelser={relevantYtelser}
          />
        </Card>
      )}

      <Card>
        <VarsletFrist behandlinger={filteredBehandlinger} />
      </Card>

      <Card>
        <FristIKabal behandlinger={filteredBehandlinger} />
      </Card>

      <Card span={3}>
        <VarsletFristPerYtelse behandlinger={filteredBehandlinger} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <FristPerYtelse behandlinger={filteredBehandlinger} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <Alder behandlinger={filteredBehandlinger} />
      </Card>

      <Card span={4}>
        <AlderPerYtelse behandlinger={filteredBehandlinger} relevantYtelser={relevantYtelser} />
      </Card>
    </ChartsWrapper>
  );
};
