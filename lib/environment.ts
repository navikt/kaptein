import { getClientEnv } from '@/lib/client';

export const isClient = typeof window !== 'undefined';

export const NAIS_CLUSTER_NAME = isClient ? getClientEnv('data-environment') : process.env.NAIS_CLUSTER_NAME;

export const isDeployedToDev = NAIS_CLUSTER_NAME === 'dev-gcp';
export const isDeployedToProd = NAIS_CLUSTER_NAME === 'prod-gcp';
export const isDeployed = isDeployedToDev || isDeployedToProd;
export const isLocal = !isDeployed;
