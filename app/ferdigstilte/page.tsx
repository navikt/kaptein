import type { Metadata } from 'next';
import { Behandlinger } from '@/app/ferdigstilte/behandlinger';
import { getDefaultSakstyper, getKlageenheter, getYtelser } from '@/lib/server/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ferdigstilte saker - Kaptein',
};

export default async function Page() {
  const ytelser = await getYtelser();
  const sakstyper = await getDefaultSakstyper();
  const klageenheter = await getKlageenheter();

  return <Behandlinger sakstyper={sakstyper} ytelser={ytelser} klageenheter={klageenheter} />;
}
