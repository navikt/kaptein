import { headers } from 'next/headers';
import { isLocal } from '@/lib/environment';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getLogger } from '@/lib/logger';
import { generateTraceParent, getFromKabal } from '@/lib/server/fetch';
import type { BehandlingResponse, IKodeverkSimpleValue, IUserData } from '@/lib/server/types';
import { ytelser } from '@/lib/server/ytelser';

const logger = getLogger('api');

const KABAL_API = isLocal ? 'https://kaptein.intern.dev.nav.no/api' : 'http://kabal-api/api/kaptein';
const _KABAL_INNSTILLINGER = isLocal ? 'https://kaptein.intern.dev.nav.no/api' : 'http://kabal-innstillinger/api';
const KLAGE_KODEVERK = isLocal ? 'https://kaptein.intern.dev.nav.no/kodeverk' : 'http://klage-kodeverk-api/kodeverk';

export const getData = async <T>(headers: Headers, url: string): Promise<T> => {
  const { traceparent, traceId, spanId } = generateTraceParent();

  try {
    const res = await (isLocal ? fetch(url, { headers }) : getFromKabal(url, headers, traceparent));

    if (res.status === 401) {
      logger.warn('Unauthorized', traceId, spanId, { url });
      throw new UnauthorizedError();
    }

    if (!res.ok) {
      logger.error(`Failed to fetch - ${res.status}`, traceId, spanId, { url });
      throw new InternalServerError(res.status, 'Kunne ikke hente data');
    }

    const data: T = await res.json();

    return data;
  } catch (error) {
    logger.error('Failed to fetch', traceId, spanId, {
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? (error.stack ?? '') : '',
    });

    throw error;
  }
};

// export const getUser = async (): Promise<IUserData> =>
//   getData(await headers(), 'https://kabal.intern.dev.nav.no/api/kabal-innstillinger/me/brukerdata');

export const getUser = async (): Promise<IUserData> => {
  return {
    navIdent: 'Z994862',
    navn: 'F_Z994862 E_Z994862',
    roller: [],
    enheter: [
      {
        id: '4295',
        navn: 'Nav Klageinstans nord',
        lovligeYtelser: [],
      },
    ],
    ansattEnhet: {
      id: '4295',
      navn: 'Nav Klageinstans nord',
      lovligeYtelser: [],
    },
    tildelteYtelser: [],
  };
};

// export const getYtelser = async () => getData<IYtelse[]>(await headers(), `${KLAGE_KODEVERK}/ytelser`);
export const getBehandlinger = async () => getData<BehandlingResponse>(await headers(), `${KABAL_API}/behandlinger`);
export const getKodeverk = async () => getData<IKodeverkSimpleValue[]>(await headers(), `${KLAGE_KODEVERK}`);

export const getYtelser = () => Promise.resolve(ytelser);
