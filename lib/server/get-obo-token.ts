import { requestOboToken, validateToken } from '@navikt/oasis';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { unauthorized } from 'next/navigation';
import { getLogger } from '@/lib/logger';
import { getTraceparent } from './traceparent';

const logger = getLogger('obo-token');

export enum AppName {
  KAPTEIN_API = 'kaptein-api',
  KABAL_API = 'kabal-api',
  KABAL_INNSTILLINGER = 'kabal-innstillinger',
  KLAGE_KODEVERK = 'klage-kodeverk',
}

export const getOboToken = async (appName: AppName, headers: ReadonlyHeaders) => {
  const authorization = headers.get('authorization');
  const { traceId, spanId } = getTraceparent(headers);

  if (authorization === null) {
    logger.error('Missing authorization header', traceId, spanId);
    return unauthorized();
  }

  const [, token] = authorization.split(' ');

  if (token === undefined) {
    logger.error('Malformed authorization header', traceId, spanId);
    return unauthorized();
  }

  const validation = await validateToken(token);

  if (!validation.ok) {
    logger.error('Invalid token', traceId, spanId);
    return unauthorized();
  }

  const audience = `api://${process.env.NAIS_CLUSTER_NAME}.klage.${appName}/.default`;

  const obo = await requestOboToken(token, audience);

  if (!obo.ok) {
    logger.error(`Failed to get on-behalf-of token for audience: ${audience}`, traceId, spanId);
    return unauthorized();
  }

  return obo.token;
};
