'use client';

import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { Alder as OldAlder } from '@/components/behandlinger/alder';
import { AlderPerYtelse as OldAlderPerYtelse } from '@/components/behandlinger/alder-per-ytelse';
import { FristIKabal as OldFristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { FristPerYtelse as OldFristPerYtelse } from '@/components/behandlinger/frist-per-ytelse';
import { LedigeVsTildelte as OldLedigeVsTildelte } from '@/components/behandlinger/ledige-vs-tildelte';
import { SakerPerYtelseOgSakstype as OldSakerPerYtelseOgSakstype } from '@/components/behandlinger/old-saker-per-ytelse-og-sakstype';
import { SakerPerSakstype as OldSakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { TildelteSakerPerKlageenhet as OldTildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet as OldTildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { TildelteSakerPåVentIkkePåVent as OldTildelteSakerPåVentIkkePåVent } from '@/components/behandlinger/tildelte-saker-på-vent-ikke-på-vent';
import { useData } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist as OldVarsletFrist } from '@/components/behandlinger/varslet-frist';
import { VarsletFristPerYtelse as OldVarsletFristPerYtelse } from '@/components/behandlinger/varslet-frist-per-ytelse';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { Alder } from '@/components/graphs/alder/graph';
import { AlderPerYtelse } from '@/components/graphs/alder-per-ytelse/graph';
import { FristIKabal } from '@/components/graphs/frist-i-kabal/graph';
import { FristPerYtelse } from '@/components/graphs/frist-per-ytelse/graph';
import { LedigeVsTildelte } from '@/components/graphs/ledige-vs-tildelte/graph';
import { SakerPerSakstype } from '@/components/graphs/saker-per-sakstype/graph';
import { SakerPerYtelseOgSakstype } from '@/components/graphs/saker-per-ytelse-og-sakstype/graph';
import { TildelteSakerPerKlageenhet } from '@/components/graphs/tildelte-saker-per-klageenhet/graph';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/graphs/tildelte-saker-per-ytelse-og-klageenhet/graph';
import { TildelteSakerPåVentIkkePåVent } from '@/components/graphs/tildelte-saker-på-vent-ikke-på-vent/graph';
import { VarsletFrist } from '@/components/graphs/varslet-frist/graph';
import { VarsletFristPerYtelse } from '@/components/graphs/varslet-frist-per-ytelse/graph';
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
        <SakerPerYtelseOgSakstype finished={false} />
      </Card>

      {/* TODO: Remove */}
      <Card span={3}>
        <OldSakerPerYtelseOgSakstype behandlinger={data} relevantYtelser={relevantYtelser} sakstyper={sakstyper} />
      </Card>

      <Card>
        <SakerPerSakstype finished={false} />
      </Card>

      {/* TODO: Remove */}
      <Card>
        <OldSakerPerSakstype behandlinger={data} sakstyper={sakstyper} />
      </Card>

      {showsAlle ? (
        <Card>
          <LedigeVsTildelte finished={false} />
        </Card>
      ) : null}

      {/* TODO: Remove */}
      {showsAlle ? (
        <Card>
          <OldLedigeVsTildelte behandlinger={data} />
        </Card>
      ) : null}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPåVentIkkePåVent finished={false} />
        </Card>
      )}

      {/* TODO: Remove */}
      {showsLedige ? null : (
        <Card>
          <OldTildelteSakerPåVentIkkePåVent behandlinger={data} />
        </Card>
      )}

      {showsLedige ? null : (
        <Card>
          <TildelteSakerPerKlageenhet finished={false} tildelt title="Tildelte saker per klageenhet" />
        </Card>
      )}

      {/* TODO: Remove */}
      {showsLedige ? null : (
        <Card>
          <OldTildelteSakerPerKlageenhet
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
            behandlinger={tildelte}
            klageenheterkodeverk={klageenheterKodeverk}
            relevantYtelser={relevantYtelser}
          />
        </Card>
      )}

      <Card>
        <VarsletFrist finished={false} />
      </Card>

      {/* TODO: Remove */}
      <Card>
        <OldVarsletFrist behandlinger={data} />
      </Card>

      <Card>
        <FristIKabal finished={false} />
      </Card>

      {/* TODO: Remove */}
      <Card>
        <OldFristIKabal behandlinger={data} />
      </Card>

      <Card span={3}>
        <VarsletFristPerYtelse finished={false} />
      </Card>

      {/* TODO: Remove */}
      <Card span={3}>
        <OldVarsletFristPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <FristPerYtelse finished={false} />
      </Card>

      {/* TODO: Remove */}
      <Card span={3}>
        <OldFristPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>

      <Card span={3}>
        <Alder finished={false} />
      </Card>

      {/* TODO: Remove */}
      <Card span={3}>
        <OldAlder behandlinger={data} />
      </Card>

      <Card span={4}>
        <AlderPerYtelse finished={false} />
      </Card>

      {/* TODO: Remove */}
      <Card span={4}>
        <OldAlderPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>
    </ChartsWrapper>
  );
};
