import type { Metadata } from 'next';
import { Behandlinger } from '@/app/saksstroem/behandlinger';
import { getYtelser } from '@/lib/server/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Saksstrøm - Kaptein',
};

export default async function Page() {
  const ytelser = await getYtelser();

  return <Behandlinger ytelser={ytelser} />;
}
