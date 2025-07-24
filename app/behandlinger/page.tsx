import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Behandlinger } from '@/app/behandlinger/behandlinger';
import { getBehandlinger, getKlageenheter, getPåVentReasons, getSakstyper, getYtelser } from '@/lib/server/api';
import { Sakstype } from '@/lib/server/types';

async function BehandlingerData() {
  const behandlinger = await getBehandlinger();
  const sakstyper = await getSakstyper();
  const ytelser = await getYtelser();
  const påVentReasons = await getPåVentReasons();
  const klageenheter = await getKlageenheter();

  const filteredBehandlinger = behandlinger.anonymizedBehandlingList.filter(
    (b) => b.typeId !== Sakstype.ANKE_I_TRYGDERETTEN && !b.isAvsluttetAvSaksbehandler && b.feilregistrering === null,
  );

  return (
    <Behandlinger
      behandlinger={filteredBehandlinger}
      sakstyper={sakstyper}
      ytelseKodeverk={ytelser}
      påVentReasons={påVentReasons}
      klageenheterKodeverk={klageenheter}
    />
  );
}

export default async function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex grow justify-center">
          <Loader size="3xlarge" />
        </div>
      }
    >
      <BehandlingerData />
    </Suspense>
  );
}
