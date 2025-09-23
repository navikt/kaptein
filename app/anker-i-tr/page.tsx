import type { Metadata } from 'next';
import { unauthorized } from 'next/navigation';
import { Behandlinger } from '@/app/aktive/behandlinger';
import { UserRoles } from '@/lib/roles';
import { getKlageenheter, getPåVentReasons, getSakstyper, getYtelser } from '@/lib/server/api';
import { hasRoles } from '@/lib/server/has-role';

export const metadata: Metadata = {
  title: 'Aktive saker - Kaptein',
};

export default async function Page() {
  if (!hasRoles(UserRoles.KABAL_OPPGAVESTYRING_ALLE_ENHETER)) {
    return unauthorized();
  }

  const ytelser = await getYtelser();
  const sakstyper = await getSakstyper();
  const klageenheter = await getKlageenheter();
  const påVentReasons = await getPåVentReasons();

  return (
    <Behandlinger sakstyper={sakstyper} ytelser={ytelser} klageenheter={klageenheter} påVentReasons={påVentReasons} />
  );
}
