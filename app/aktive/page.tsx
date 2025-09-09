import { Suspense } from 'react';
import { Behandlinger } from '@/app/aktive/behandlinger';
import { BehandlingerProgress } from '@/components/behandlinger/progress';
import { getKlageenheter, getSakstyperWithoutAnkeITR, getYtelser } from '@/lib/server/api';
import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';

async function BehandlingerData() {
  const sakstyper = await getSakstyperWithoutAnkeITR();
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();

  const behandlinger = BEHANDLINGER_DATA_LOADER.getData();
  const filteredBehandlinger = behandlinger.filter((b) => !b.isAvsluttetAvSaksbehandler);

  return (
    <Behandlinger
      behandlinger={filteredBehandlinger}
      sakstyper={sakstyper}
      ytelseKodeverk={ytelser}
      klageenheterKodeverk={klageenheter}
    />
  );
}

export default async function Page() {
  return (
    <Suspense fallback={<BehandlingerProgress />}>
      <BehandlingerData />
    </Suspense>
  );
}
