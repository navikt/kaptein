import { DataLoader, type HasKeyFn } from '@/lib/server/data-loader';
import { AppName } from '@/lib/server/get-obo-token';
import type { ParserFn } from '@/lib/server/stream';
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

const behandlingParser: ParserFn<Behandling> = (data) => {
  const parsed = JSON.parse(data);

  if (!isBehandling(parsed)) {
    throw new Error('Invalid behandling object');
  }

  return parsed;
};

const hasKey: HasKeyFn<Behandling> = (item, key) => item.id === key;

declare global {
  var __BEHANDLINGER_DATA_LOADER__: DataLoader<Behandling> | undefined;
}

function getBehandlingerDataLoader(): DataLoader<Behandling> {
  if (globalThis.__BEHANDLINGER_DATA_LOADER__ === undefined) {
    globalThis.__BEHANDLINGER_DATA_LOADER__ = new DataLoader<Behandling>(
      AppName.KABAL_API,
      '/behandlinger-stream',
      behandlingParser,
      hasKey,
      'klage.kaptein-behandling.v1',
      'Behandlinger',
    );
  }

  return globalThis.__BEHANDLINGER_DATA_LOADER__;
}

export const BEHANDLINGER_DATA_LOADER = getBehandlingerDataLoader();
