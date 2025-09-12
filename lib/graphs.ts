import type { Behandling, IKodeverkSimpleValue, IYtelse, Sakstype } from '@/lib/server/types';

export enum Graph {
  ALDER_PER_YTELSE = 'alder-per-ytelse',
  SAKER_PER_YTELSE_OG_SAKSTYPE = 'saker-per-ytelse-og-sakstype',
  ALDER = 'alder',
  FRIST_I_KABAL_PER_YTELSE = 'frist-i-kabal-per-ytelse',
  FRIST_I_KABAL = 'frist-i-kabal',
  TILDELTE_SAKER_PER_KLAGEENHET = 'tildelte-saker-per-klageenhet',
  SAKER_PER_SAKSTYPE = 'saker-per-sakstype',
  TILDELTE_SAKER_PER_YTELSE_OG_KLAGEENHET = 'tildelte-saker-per-ytelse-og-klageenhet',
  VARSLET_FRIST = 'varslet-frist',
  VARSLET_FRIST_PER_YTELSE = 'varslet-frist-per-ytelse',
  FRIST_PER_YTELSE = 'frist-per-ytelse',
  LEDIGE_VS_TILDELTE = 'ledige-vs-tildelte',
}

const GRAPHS = Object.values(Graph);

export const isGraphName = (name: string): name is Graph => GRAPHS.includes(name as Graph);

export const GRAPH_DATA_EVENT_NAME = 'graph';

export interface EntryData<S> {
  count: number;
  state: S;
}

export interface GetGraphStateParams {
  behandlinger: Behandling[];
  ytelser: IYtelse[];
  sakstyper: IKodeverkSimpleValue<Sakstype>[];
  klageenheter: IKodeverkSimpleValue[];
  searchParams: URLSearchParams;
}

export type GetGraphStateFn<S> = (params: GetGraphStateParams) => EntryData<S>;

export type GetGraphStateJsonFn = (params: GetGraphStateParams) => string;
