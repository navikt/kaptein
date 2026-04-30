'use server';

import { requestOboToken, validateToken } from '@navikt/oasis';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';
import { unauthorized } from 'next/navigation';
import type { AppName } from '@/lib/app-name';
import { getLogger } from '@/lib/logger';

const logger = getLogger('obo-token');

const tracer = trace.getTracer('kaptein');

export const getOboToken = async (appName: AppName, headers: ReadonlyHeaders) =>
  tracer.startActiveSpan('getOboToken', async (span) => {
    try {
      span.setAttribute('token.audience', appName);

      const authorization = headers.get('authorization');

      if (authorization === null) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Missing authorization header' });
        logger.error('Missing authorization header');
        unauthorized();
      }

      const [, token] = authorization.split(' ');

      if (token === undefined) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Malformed authorization header' });
        logger.error('Malformed authorization header');
        unauthorized();
      }

      const validation = await validateToken(token);

      if (!validation.ok) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Invalid token' });
        logger.error('Invalid token');
        unauthorized();
      }

      const audience = `api://${process.env.NAIS_CLUSTER_NAME}.klage.${appName}/.default`;

      const obo = await requestOboToken(token, audience);

      if (!obo.ok) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: `Failed to get OBO token for ${audience}` });
        logger.error(`Failed to get on-behalf-of token for audience: ${audience}`);
        unauthorized();
      }

      return obo.token;
    } finally {
      span.end();
    }
  });
