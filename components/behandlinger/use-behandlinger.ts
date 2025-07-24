import { type Behandling, type BehandlingResponse, Sakstype } from '@/lib/server/types';

export const useBehandlinger = (behandlinger: BehandlingResponse, extraFilter?: (b: Behandling) => boolean) =>
  behandlinger.anonymizedBehandlingList.filter(
    (b) => b.typeId !== Sakstype.ANKE_I_TRYGDERETTEN && b.feilregistrering === null && (extraFilter?.(b) ?? true),
  );
