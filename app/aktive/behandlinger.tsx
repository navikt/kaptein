'use client';

import { useQueryState } from 'nuqs';
import { parseAsLedigeFilter } from '@/app/custom-query-parsers';
import { TildelingFilter } from '@/app/query-types';
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
import { QueryParam } from '@/lib/types/query-param';

export const Behandlinger = () => {
  const [tildelingFilter] = useQueryState(QueryParam.TILDELING, parseAsLedigeFilter);
  const showsLedige = tildelingFilter === TildelingFilter.LEDIGE;
  const showsAlle = tildelingFilter === TildelingFilter.ALL;

  return (
    <ChartsWrapper>
      <Card span={3}>
        <SakerPerYtelseOgSakstype finished={false} />
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
