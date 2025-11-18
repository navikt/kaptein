import type { Metadata } from 'next';
import { Behandlinger } from '@/app/aktive-saker-i-tr/behandlinger';
import { getKlageenheter, getYtelser } from '@/lib/server/api';

export const metadata: Metadata = {
  title: 'Ferdigstilte saker - Kaptein',
};

export default async function Page() {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();

  return <Behandlinger ytelser={ytelser} klageenheter={klageenheter} />;
}
