import type { Metadata } from 'next';
import { Behandlinger } from '@/app/aktive/behandlinger';
import { getDefaultSakstyper, getKlageenheter, getPåVentReasons, getYtelser } from '@/lib/server/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Aktive saker - Kaptein',
};

export default async function Page() {
  const ytelser = await getYtelser();
  const sakstyper = await getDefaultSakstyper();
  const klageenheter = await getKlageenheter();
  const påVentReasons = await getPåVentReasons();

  return (
    <Behandlinger sakstyper={sakstyper} ytelser={ytelser} klageenheter={klageenheter} påVentReasons={påVentReasons} />
  );
}
