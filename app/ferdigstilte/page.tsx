import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Behandlinger } from '@/app/ferdigstilte/behandlinger';
import { useBehandlinger } from '@/components/behandlinger/use-behandlinger';
import { getBehandlinger, getKlageenheter, getSakstyperWithoutAnkeITR, getYtelser } from '@/lib/server/api';

async function BehandlingerData() {
  const behandlinger = await getBehandlinger();
  const sakstyper = await getSakstyperWithoutAnkeITR();
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();

  const filteredBehandlinger = useBehandlinger(behandlinger, (b) => b.isAvsluttetAvSaksbehandler);

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
