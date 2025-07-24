import { isLocal } from '@/lib/environment';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getLogger } from '@/lib/logger';
import { generateTraceParent, getFromKabal } from '@/lib/server/fetch';

const logger = getLogger('api');

const SAKER_API_URL = isLocal ? 'https://mine-klager.intern.dev.nav.no/api/saker' : 'http://kabal-api/api/innsyn/saker';

export const getSaker = async (headers: Headers): Promise<unknown> => {
  const { traceparent, traceId, spanId } = generateTraceParent();

  try {
    const res = await (isLocal ? fetch(SAKER_API_URL, { headers }) : getFromKabal(SAKER_API_URL, headers, traceparent));

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
