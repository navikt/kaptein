import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Behandlinger } from '@/app/behandlinger/behandlinger';
import { getBehandlinger, getSakstyper } from '@/lib/server/api';
import { Sakstype } from '@/lib/server/types';

async function BehandlingerData() {
  const behandlinger = await getBehandlinger();
  const sakstyper = await getSakstyper();

  const filteredBehandlinger = behandlinger.anonymizedBehandlingList.filter(
    (b) => b.typeId !== Sakstype.ANKE_I_TRYGDERETTEN && !b.isAvsluttetAvSaksbehandler && b.feilregistrering === null,
  );

  return <Behandlinger behandlinger={filteredBehandlinger} sakstyper={sakstyper} />;
}

export default async function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center grow">
          <Loader size="3xlarge" />
        </div>
      }
    >
      <BehandlingerData />
    </Suspense>
  );
}
