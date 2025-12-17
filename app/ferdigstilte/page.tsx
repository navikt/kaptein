import type { Metadata } from 'next';
import { Behandlinger } from '@/app/ferdigstilte/behandlinger';
import { getDefaultSakstyper, getKlageenheter, getUtfall, getYtelser } from '@/lib/server/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ferdigstilte saker i KA - Kaptein',
};

export default async function Page() {
  const ytelser = await getYtelser();
  const sakstyper = await getDefaultSakstyper();
  const klageenheter = await getKlageenheter();
  const utfall = await getUtfall();

  return <Behandlinger sakstyper={sakstyper} ytelser={ytelser} klageenheter={klageenheter} utfall={utfall} />;
}
