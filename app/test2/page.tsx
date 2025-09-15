import { Behandlinger } from '@/app/test2/behandlinger';
import { getKlageenheter, getSakstyper } from '@/lib/server/api';

export default async function Page() {
  const sakstyper = await getSakstyper();
  const klageenheter = await getKlageenheter();

  return <Behandlinger sakstyper={sakstyper} klageenheter={klageenheter} />;
}
