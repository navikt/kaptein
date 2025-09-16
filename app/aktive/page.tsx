import { Behandlinger } from '@/app/aktive/behandlinger';
import { getSakstyper, getYtelser } from '@/lib/server/api';

export default async function Page() {
  const ytelser = await getYtelser();
  const sakstyper = await getSakstyper();

  return <Behandlinger sakstyper={sakstyper} ytelser={ytelser} />;
}
