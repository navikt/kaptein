'use client';

import { useQueryState } from 'nuqs';
import { useMemo } from 'react';
import { parseAsLedigeFilter, TildelingFilter } from '@/app/custom-query-parsers';
import { AlderPerYtelse } from '@/components/behandlinger/alder-per-ytelse';
import { FristIKabal } from '@/components/behandlinger/frist-i-kabal';
import { LedigeVsTildelte } from '@/components/behandlinger/ledige-vs-tildelte';
import { OverskredetVarsletFrist } from '@/components/behandlinger/overskredet-varslet-frist';
import { SakerPerSakstype } from '@/components/behandlinger/saker-per-sakstype';
import { SakerPerYtelse } from '@/components/behandlinger/saker-per-ytelse-og-sakstype';
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
  const showsTildelte = tildelingFilter === TildelingFilter.TILDELTE;
  const showsLedige = tildelingFilter === TildelingFilter.LEDIGE;
  const showsAlle = tildelingFilter === TildelingFilter.ALL;
  const relevantYtelser = useRelevantYtelser(behandlinger, ytelseKodeverk);
  debugBehandlinger(behandlinger);
  console.log('Data', data);

  const tildelte = useMemo(() => withoutTildelteFilter.filter((b) => b.isTildelt), [withoutTildelteFilter]);

  return (
    <ChartsWrapper>
      <Card>
        <SakerPerYtelse
          behandlinger={data}
          total={behandlinger.length}
          relevantYtelser={relevantYtelser}
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

      <Card>
        <VarsletFristPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>

      <Card>
        <OverskredetVarsletFrist behandlinger={data} />
      </Card>

      <Card>
        <AlderPerYtelse behandlinger={data} relevantYtelser={relevantYtelser} />
      </Card>
    </ChartsWrapper>
  );
};
