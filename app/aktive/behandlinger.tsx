'use client';

import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
import { Alder } from '@/components/behandlinger/alder';
import { AlderPerYtelse } from '@/components/behandlinger/alder-per-ytelse/graph';
import { FristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { FristPerYtelse } from '@/components/behandlinger/frist-per-ytelse';
import { LedigeVsTildelte } from '@/components/behandlinger/ledige-vs-tildelte';
import { SakerPerYtelseOgSakstype } from '@/components/behandlinger/old-saker-per-ytelse-og-sakstype';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { SakerPerYtelse } from '@/components/behandlinger/saker-per-ytelse-og-sakstype/graph';
import { TildelteSakerPerKlageenhet } from '@/components/behandlinger/tildelte-saker-per-klageenhet';
import { TildelteSakerPerYtelseOgKlageenhet } from '@/components/behandlinger/tildelte-saker-per-ytelse-og-klageenhet';
import { TildelteSakerPåVentIkkePåVent } from '@/components/behandlinger/tildelte-saker-på-vent-ikke-på-vent';
import { useData } from '@/components/behandlinger/use-data';
import { useRelevantYtelser } from '@/components/behandlinger/use-relevant-ytelser';
import { VarsletFrist } from '@/components/behandlinger/varslet-frist';
import { VarsletFristPerYtelse } from '@/components/behandlinger/varslet-frist-per-ytelse';
import { Card } from '@/components/cards';
import { ChartsWrapper } from '@/components/charts-wrapper/charts-wrapper';
import { debugBehandlinger } from '@/components/debug';
import { browserLog } from '@/lib/browser-log';
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
  debugBehandlinger(behandlinger);
  browserLog.debug('Data', data);

  const tildelte = useMemo(() => withoutTildelteFilter.filter((b) => b.isTildelt), [withoutTildelteFilter]);

  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelse />
      </Card>

      {/* TODO: Remove this when <SakerPerYtelse /> shows correct data */}
      <Card span={3}>
        <SakerPerYtelseOgSakstype behandlinger={data} relevantYtelser={relevantYtelser} sakstyper={sakstyper} />
      </Card>

      <Card>
        <SakerPerSakstype behandlinger={data} sakstyper={sakstyper} />
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
            behandlinger={tildelte}
            relevantYtelser={relevantYtelser}
            klageenheterkodeverk={klageenheterKodeverk}
          />
        </Card>
      )}

      <Card>
        <VarsletFrist behandlinger={data} />
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
        <Alder behandlinger={data} />
      </Card>

      <Card span={4}>
        <AlderPerYtelse />
      </Card>
    </ChartsWrapper>
  );
};
