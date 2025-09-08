import { type Behandling, Sakstype } from '@/lib/server/types';

export const useBehandlinger = (behandlinger: Behandling[], extraFilter?: (b: Behandling) => boolean) =>
  behandlinger.filter(
    (b) => b.typeId !== Sakstype.ANKE_I_TRYGDERETTEN && b.feilregistrering === null && (extraFilter?.(b) ?? true),
  );
