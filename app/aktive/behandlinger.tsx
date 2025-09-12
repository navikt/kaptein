'use client';

import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { FristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { FristPerYtelse } from '@/components/behandlinger/frist-per-ytelse';
import { LedigeVsTildelte } from '@/components/behandlinger/ledige-vs-tildelte';
import { SakerPerSakstype as OldSakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { TildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet as OldTildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { TildelteSakerPåVentIkkePåVent } from '@/components/behandlinger/tildelte-saker-på-vent-ikke-på-vent';
import { useData } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist as OldVarsletFrist } from '@/components/behandlinger/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/behandlinger/varslet-frist-per-ytelse';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { Alder } from '@/components/graphs/alder/graph';
import { AlderPerYtelse } from '@/components/graphs/alder-per-ytelse/graph';
import { SakerPerSakstype } from '@/components/graphs/saker-per-sakstype/graph';
import { SakerPerYtelseOgSakstype } from '@/components/graphs/saker-per-ytelse-og-sakstype/graph';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/graphs/tildelte-saker-per-ytelse-og-klageenhet/graph';
import { VarsletFrist } from '@/components/graphs/varslet-frist/graph';
import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';
import { QueryParam } from '@/lib/types/query-param';

interface Props {
  behandlinger: Behandling[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  ytelseKodeverk: IYtelse[];
  klageenheterKodeverk: IKodeverkSimpleValue[];
}

export const Behandlinger = ({ behandlinger, sakstyper, ytelseKodeverk, klageenheterKodeverk }: Props) => {
  const { withTildelteFilter: data, withoutTildelteFilter } = useData(behandlinger);
  const [tildelingFilter] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);
  const showsLedige = tildelingFilter === TildelingFilter.LEDIGE;
  const showsAlle = tildelingFilter === TildelingFilter.ALL;
  const relevantYtelser = useRelevantYtelser(behandlinger, ytelseKodeverk);

  const tildelte = useMemo(() => withoutTildelteFilter.filter((b) => b.isTildelt), [withoutTildelteFilter]);

  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelseOgSakstype tildelt finished={false} />
      </Card>

      <Card>
        <SakerPerSakstype tildelt finished={false} />
      </Card>

      {/* TODO: Remove */}
      <Card>
        <OldSakerPerSakstype behandlinger={data} sakstyper={sakstyper} />
      </Card>

      {showsAlle ? (
        <Card>
          <LedigeVsTildelte behandlinger={data} />
        </Card>
      ) : null}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPåVentIkkePåVent behandlinger={data} />
        </Card>
      )}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPerKlageenhet
            behandlinger={tildelte}
            klageenheter={klageenheterKodeverk}
            title="Tildelte saker per klageenhet"
          />
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

      {/* TODO: Remove */}
      {showsLedige ? null : (
        <Card span={3}>
          <OldTildelteSakerPerYtelseOgKlageenhet
            title="Tildelte saker per ytelse og klageenhet"
            behandlinger={data}
            klageenheterkodeverk={klageenheterKodeverk}
            relevantYtelser={relevantYtelser}
          />
        </Card>
      )}

      <Card>
        <VarsletFrist tildelt finished={false} />
      </Card>

      {/* TODO: Remove */}
      <Card>
        <OldVarsletFrist behandlinger={data} />
      </Card>

      <Card>
        <FristIKabal behandlinger={data} />
      </Card>

      <Card span={3}>
        <VarsletFristPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <FristPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <Alder />
      </Card>

      <Card span={4}>
        <AlderPerYtelse />
      </Card>
    </ChartsWrapper>
  );
};
