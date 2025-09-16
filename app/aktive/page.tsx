import { Behandlinger } from '@/app/aktive/behandlinger';
import { getKlageenheter, getPåVentReasons, getSakstyper, getYtelser } from '@/lib/server/api';

export default async function Page() {
  const ytelser = await getYtelser();
  const sakstyper = await getSakstyper();
  const klageenheter = await getKlageenheter();
  const påVentReasons = await getPåVentReasons();

  return (
    <Behandlinger sakstyper={sakstyper} ytelser={ytelser} klageenheter={klageenheter} påVentReasons={påVentReasons} />
  );
}
