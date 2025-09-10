import { getLogger } from '@/lib/logger';
import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';
import { generateSpanId, generateTraceId } from '@/lib/server/traceparent';

const log = getLogger('readiness');

export function GET() {
  const traceId = generateTraceId();
  const spanId = generateSpanId();

  log.info('Readiness check initiated', traceId, spanId);

  if (!BEHANDLINGER_DATA_LOADER.isReady()) {
    log.warn('Readiness check failed: Behandling dataloader is not ready', traceId, spanId);
    return new Response('Behandling dataloader is not ready...', { status: 503 });
  }

  log.info('Readiness check success', traceId, spanId);

  return new Response('I am ready!', {
    status: 200,
    headers: { 'content-type': 'text/plain' },
  });
}
