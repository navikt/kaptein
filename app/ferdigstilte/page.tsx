import type { Metadata } from 'next';
import { Behandlinger } from '@/app/ferdigstilte/behandlinger';
import { getKlageenheter, getSakstyper, getYtelser } from '@/lib/server/api';

export const metadata: Metadata = {
  title: 'Ferdigstilte saker - Kaptein',
};

export default async function Page() {
  const ytelser = await getYtelser();
  const sakstyper = await getSakstyper();
  const klageenheter = await getKlageenheter();

  return <Behandlinger sakstyper={sakstyper} ytelser={ytelser} klageenheter={klageenheter} />;
}
