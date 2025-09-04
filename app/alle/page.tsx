import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Behandlinger } from '@/components/behandlinger/behandlinger';
import { useBehandlinger } from '@/components/behandlinger/use-behandlinger';
import {
  getBehandlinger,
  getKlageenheter,
  getPåVentReasons,
  getSakstyperWithoutAnkeITR,
  getYtelser,
} from '@/lib/server/api';

async function BehandlingerData() {
  const behandlinger = await getBehandlinger();
  const sakstyper = await getSakstyperWithoutAnkeITR();
  const ytelser = await getYtelser();
  const påVentReasons = await getPåVentReasons();
  const klageenheter = await getKlageenheter();

  const filteredBehandlinger = useBehandlinger(behandlinger);

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
        <div className="flex grow items-center justify-center">
          <Loader size="3xlarge" className="size-fit" />
        </div>
      }
    >
      <BehandlingerData />
    </Suspense>
  );
}
