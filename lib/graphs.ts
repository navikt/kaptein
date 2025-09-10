export enum Graph {
  ALDER_PER_YTELSE = 'alder-per-ytelse',
  SAKER_PER_YTELSE_OG_SAKSTYPE = 'saker-per-ytelse-og-sakstype',
}

const GRAPHS = Object.values(Graph);

export const isGraphName = (name: string): name is Graph => GRAPHS.includes(name as Graph);

export const GRAPH_DATA_EVENT_NAME = 'graph';
