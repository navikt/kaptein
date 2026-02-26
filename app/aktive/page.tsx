import type { Metadata } from 'next';
import { Behandlinger } from '@/app/aktive/behandlinger';
import { getKASakstyper, getKlageenheter, getSakstyperToPåVentReasons, getYtelser } from '@/lib/server/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Aktive saker i KA - Kaptein',
};

export default async function Page() {
  const ytelser = await getYtelser();
  const sakstyper = await getKASakstyper();
  const klageenheter = await getKlageenheter();
  const sakstyperToPåVentReasons = await getSakstyperToPåVentReasons();

  return (
    <Behandlinger
      sakstyper={sakstyper}
      ytelser={ytelser}
      klageenheter={klageenheter}
      sakstyperToPåVentReasons={sakstyperToPåVentReasons}
    />
  );
}
