import type { Metadata } from 'next';
import { Behandlinger } from '@/app/behandlingstid/behandlinger';

export const metadata: Metadata = {
  title: 'Behandlingstid - Kaptein',
};

export default async function Page() {
  return <Behandlinger />;
}
