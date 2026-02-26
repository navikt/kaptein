import type { Metadata } from 'next';
import { Behandlinger } from '@/app/aktive-saker-i-tr/behandlinger';
import { getKlageenheter, getSakstyperToPåVentReasons, getYtelser } from '@/lib/server/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Aktive saker i TR - Kaptein',
};

export default async function Page() {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();
  const sakstyperToPåVentReasons = await getSakstyperToPåVentReasons();

  return (
    <Behandlinger ytelser={ytelser} klageenheter={klageenheter} sakstyperToPåVentReasons={sakstyperToPåVentReasons} />
  );
}
