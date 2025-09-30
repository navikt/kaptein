import type { Metadata } from 'next';
import { Behandlinger } from '@/app/saksstroem/behandlinger';

export const metadata: Metadata = {
  title: 'Saksstrøm - Kaptein',
};

export default async function Page() {
  return <Behandlinger />;
}
