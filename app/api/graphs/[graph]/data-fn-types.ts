import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';

export interface GetGraphStateParams {
  behandlinger: Behandling[];
  ytelser: IYtelse[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  klageenheter: IKodeverkSimpleValue[];
  searchParams: URLSearchParams;
}

export type GetGraphStateFn = (params: GetGraphStateParams) => string;
