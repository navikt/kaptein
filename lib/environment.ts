import { getClientEnv } from '@/lib/client';

export const isClient = typeof window !== 'undefined';

export const NAIS_CLUSTER_NAME = isClient ? getClientEnv('data-environment') : process.env.NAIS_CLUSTER_NAME;

export const isDeployedToDev = NAIS_CLUSTER_NAME === 'dev-gcp';
export const isDeployedToProd = NAIS_CLUSTER_NAME === 'prod-gcp';
export const isDeployed = isDeployedToDev || isDeployedToProd;
export const isLocal = !isDeployed;

export const requiredEnvString = (name: string, defaultValue?: string): string => {
  const envVariable = process.env[name];

  if (typeof envVariable === 'string' && envVariable.length > 0) {
    return envVariable;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Missing required environment variable '${name}'.`);
};
