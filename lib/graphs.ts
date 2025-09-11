export enum Graph {
  ALDER_PER_YTELSE = 'alder-per-ytelse',
  SAKER_PER_YTELSE_OG_SAKSTYPE = 'saker-per-ytelse-og-sakstype',
  ALDER = 'alder',
  FRIST_I_KABAL_PER_YTELSE = 'frist-i-kabal-per-ytelse',
  FRIST_I_KABAL = 'frist-i-kabal',
  TILDELTE_SAKER_PER_KLAGEENHET = 'tildelte-saker-per-klageenhet',
}

const GRAPHS = Object.values(Graph);

export const isGraphName = (name: string): name is Graph => GRAPHS.includes(name as Graph);

export const GRAPH_DATA_EVENT_NAME = 'graph';

export interface EntryData<S> {
  count: number;
  state: S;
}
