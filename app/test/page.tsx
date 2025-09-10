import { Loader } from '@navikt/ds-react';
import { Suspense } from 'react';
import { Behandlinger } from '@/app/test/behandlinger';

async function BehandlingerData() {
  return <Behandlinger />;
}

export default async function Page() {
  return (
    <Suspense fallback={<Loader />}>
      <BehandlingerData />
    </Suspense>
  );
}
