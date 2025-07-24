import { type Static, Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { isDeployed, NAIS_CLUSTER_NAME, requiredEnvString } from '@/lib/environment';
import { getLogger } from '@/lib/logger';
import { generateSpanId, generateTraceId } from '@/lib/server/traceparent';

const TOKEN_ENDPOINT = isDeployed ? requiredEnvString('NAIS_TOKEN_ENDPOINT') : '';

const target = `api://${NAIS_CLUSTER_NAME}.klage.kabal-api/.default`;

const log = getLogger('azure-token');

export const getToken = async (traceId = generateTraceId()): Promise<TokenResponse> => {
  const spanId = generateSpanId();

  log.debug('Fetching Azure token...', traceId, spanId);

  const start = performance.now();

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identity_provider: 'azuread',
      target,
    }),
  });

  const duration = performance.now() - start;

  if (!res.ok) {
    log.error('Failed to fetch Azure token', traceId, spanId, { status: res.status, duration });

    throw new Error(`Failed to fetch Azure token: ${res.statusText}`);
  }

  log.debug(`Successfully fetched Azure token in ${duration}ms`, traceId, spanId, {
    status: res.status,
    duration,
    trace_id: traceId,
    span_id: spanId,
  });

  const data = await res.json();

  if (!CHECKER.Check(data)) {
    const errors = [...CHECKER.Errors(data)].join(', ');
    log.error('Invalid Azure token response', traceId, spanId, { status: res.status, duration, errors });

    throw new Error(`Invalid Azure token response: ${errors}`);
  }

  return data;
};

const RESPONSE_TYPE = Type.Object({
  access_token: Type.String(),
  expires_in: Type.Number(),
  token_type: Type.String(),
});

const CHECKER = TypeCompiler.Compile(RESPONSE_TYPE);

type TokenResponse = Static<typeof RESPONSE_TYPE>;
