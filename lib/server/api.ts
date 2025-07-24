import { isLocal } from '@/lib/environment';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getLogger } from '@/lib/logger';
import { generateTraceParent, getFromKabal } from '@/lib/server/fetch';
import type { IUserData } from '@/lib/server/types';

const logger = getLogger('api');

const _KABAL_INNSTILLINGER = isLocal ? 'https://kaptein.intern.dev.nav.no/api/' : 'http://kabal-innstillinger/api';

const _getData = async (headers: Headers, url: string): Promise<unknown> => {
  const { traceparent, traceId, spanId } = generateTraceParent();

  try {
    const res = await (isLocal ? fetch(url, { headers }) : getFromKabal(url, headers, traceparent));

    if (res.status === 401) {
      logger.warn('Unauthorized fetch of cases', traceId, spanId);
      throw new UnauthorizedError();
    }

    if (!res.ok) {
      logger.error(`Failed to fetch cases - ${res.status}`, traceId, spanId);
      throw new InternalServerError(res.status, 'Kunne ikke hente data');
    }

    return res.json();
  } catch (error) {
    logger.error('Failed to fetch cases', traceId, spanId, {
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
