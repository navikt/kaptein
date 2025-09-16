'use client';

import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { SakerPerYtelseOgSakstype } from '@/components/behandlinger/saker-per-ytelse-og-sakstype';
import { useAktive } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { Alder } from '@/components/graphs/alder/graph';
import { AlderPerYtelse } from '@/components/graphs/alder-per-ytelse/graph';
import { FristIKabal } from '@/components/graphs/frist-i-kabal/graph';
import { FristPerYtelse } from '@/components/graphs/frist-per-ytelse/graph';
import { LedigeVsTildelte } from '@/components/graphs/ledige-vs-tildelte/graph';
import { SakerPerSakstype } from '@/components/graphs/saker-per-sakstype/graph';
import { TildelteSakerPerKlageenhet } from '@/components/graphs/tildelte-saker-per-klageenhet/graph';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/graphs/tildelte-saker-per-ytelse-og-klageenhet/graph';
import { TildelteSakerPåVentIkkePåVent } from '@/components/graphs/tildelte-saker-på-vent-ikke-på-vent/graph';
import { VarsletFrist } from '@/components/graphs/varslet-frist/graph';
import { VarsletFristPerYtelse } from '@/components/graphs/varslet-frist-per-ytelse/graph';
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
}

export const Behandlinger = ({ sakstyper, ytelser }: KodeverkProps) => {
  const ledige = useClientFetch<LedigBehandling[]>('/api/behandlinger/ledige');
  const tildelte = useClientFetch<TildeltBehandling[]>('/api/behandlinger/tildelte');

  if (ledige === null || tildelte === null) {
    // TODO: Loading skeleton
    return <div>Laster...</div>;
  }

  return <BehandlingerData ledige={ledige} tildelte={tildelte} sakstyper={sakstyper} ytelser={ytelser} />;
};
const BehandlingerData = ({ ledige, tildelte, sakstyper, ytelser }: Props & KodeverkProps) => {
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
        <SakerPerSakstype finished={false} />
      </Card>

      {showsAlle ? (
        <Card>
          <LedigeVsTildelte finished={false} />
        </Card>
      ) : null}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPåVentIkkePåVent finished={false} />
        </Card>
      )}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPerKlageenhet finished={false} tildelt title="Tildelte saker per klageenhet" />
        </Card>
      )}

      {showsLedige ? null : (
        <Card span={3}>
          <TildelteSakerPerYtelseOgKlageenhet
            title="Tildelte saker per ytelse og klageenhet"
            tildelt
            finished={false}
          />
        </Card>
      )}

      <Card>
        <VarsletFrist finished={false} />
      </Card>

      <Card>
        <FristIKabal finished={false} />
      </Card>

      <Card span={3}>
        <VarsletFristPerYtelse finished={false} />
      </Card>

      <Card span={3}>
        <FristPerYtelse finished={false} />
      </Card>

      <Card span={3}>
        <Alder finished={false} />
      </Card>

      <Card span={4}>
        <AlderPerYtelse finished={false} />
      </Card>
    </ChartsWrapper>
  );
};
