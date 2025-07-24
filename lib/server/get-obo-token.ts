import { requestOboToken, validateToken } from '@navikt/oasis';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { unauthorized } from 'next/navigation';
import { getLogger } from '@/lib/logger';
import { getTraceparent } from '@/lib/server/fetch';

const logger = getLogger('obo-token');

export enum AppName {
  KABAL_API = 'kabal-api',
}

export const getOboToken = async (appName: AppName, headers: ReadonlyHeaders) => {
  const authorization = headers.get('authorization');
  const { traceId, spanId } = getTraceparent(headers);

  if (authorization === null) {
    logger.error('Missing authorization header', traceId, spanId);
    unauthorized();
  }

  const [, token] = authorization.split(' ');

  const validation = await validateToken(token);

  if (!validation.ok) {
    logger.error('Invalid token', traceId, spanId);
    unauthorized();
  }

  const audience = `api://${process.env.NAIS_CLUSTER_NAME}.klage.${appName}/.default`;

  const obo = await requestOboToken(token, audience);

  if (!obo.ok) {
    logger.error(`Failed to get on-behalf-of token for audience: ${audience}`, traceId, spanId);
    unauthorized();
  }

  return obo.token;
};
