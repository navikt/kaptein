import type { Metadata } from 'next';
import { Behandlinger } from '@/app/ferdigstilte-anker-i-tr/behandlinger';
import { getKlageenheter, getRegistreringshjemlerMap, getUtfall, getYtelser } from '@/lib/server/api';

export const metadata: Metadata = {
  title: 'Ferdigstilte saker - Kaptein',
};

export default async function Page() {
  const ytelser = await getYtelser();
  const klageenheter = await getKlageenheter();
  const registreringshjemlerMap = await getRegistreringshjemlerMap();
  const utfall = await getUtfall();

  return (
    <Behandlinger
      ytelser={ytelser}
      klageenheter={klageenheter}
      registreringshjemlerMap={registreringshjemlerMap}
      utfall={utfall}
    />
  );
}
