import { Behandlinger } from '@/app/aktive/behandlinger';
import { getKlageenheter, getSakstyper, getYtelser } from '@/lib/server/api';

export default async function Page() {
  const ytelser = await getYtelser();
  const sakstyper = await getSakstyper();
  const klageenheter = await getKlageenheter();

  return <Behandlinger sakstyper={sakstyper} ytelser={ytelser} klageenheter={klageenheter} />;
}
