import { DataLoader } from '@/lib/server/data-loader';
import { AppName } from '@/lib/server/get-obo-token';
import type { Behandling } from '@/lib/server/types';

const isRecord = (obj: unknown): obj is Record<string, unknown> =>
  obj !== null && typeof obj === 'object' && !Array.isArray(obj);

const isBehandling = (b: unknown): b is Behandling => {
  if (!isRecord(b)) {
    return false;
  }

  if (typeof b.ageKA !== 'number') {
    return false;
  }

  return true;
};

const behandlingParser = (data: string): Behandling => {
  const parsed = JSON.parse(data);

  if (!isBehandling(parsed)) {
    throw new Error('Invalid behandling object');
  }

  return parsed;
};

export const BEHANDLINGER_DATA_LOADER = new DataLoader<Behandling>(
  AppName.KABAL_API,
  '/behandlinger-stream',
  behandlingParser,
  'Behandlinger',
);
