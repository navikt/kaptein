import type { OutgoingHttpHeaders } from 'node:http';
import type { NextRequest } from 'next/server';
import { formatBytes } from '@/app/api/behandlinger/[status]/format-bytes';
import { isDeployed, isLocal } from '@/lib/environment';
import { getLogger } from '@/lib/logger';
import { AppName, getOboToken } from '@/lib/server/get-obo-token';
import { AbortError, ProxyError, TimeoutError } from '@/lib/server/proxy/errors';
import { type EndInfo, handleProxyRequest } from '@/lib/server/proxy/proxy';
import { generateTraceParent, parseTraceParent } from '@/lib/server/traceparent';

const log = getLogger('behandlinger-proxy');

export const dynamic = 'force-dynamic';

const KAPTEIN_URL = isLocal
  ? new URL('https://kaptein.intern.dev.nav.no/api/behandlinger')
  : new URL('http://kaptein-api/behandlinger');

export async function GET(req: NextRequest, ctx: RouteContext<'/api/behandlinger/[status]'>): Promise<Response> {
  const incomingTraceparent = req.headers.get('traceparent');
  const { traceparent, traceId, spanId } =
    incomingTraceparent === null ? generateTraceParent() : parseTraceParent(incomingTraceparent);

  const { status } = await ctx.params;

  log.debug(`Proxying GET /kaptein-api/behandlinger/${status}`, traceId, spanId);

  const url = new URL(KAPTEIN_URL);

  url.pathname += `/${status}`;

  const overrideHeaders: OutgoingHttpHeaders = { traceparent };

  if (isDeployed) {
    const token = await getOboToken(AppName.KAPTEIN_API, req.headers);
    overrideHeaders.authorization = `Bearer ${token}`;
  }

  const onEnd = ({ bytes, duration }: EndInfo) =>
    log.info(`Proxied ${formatBytes(bytes)} bytes in ${duration} ms`, traceId, spanId);

  try {
    return handleProxyRequest(req, { targetUrl: url, timeout: 5_000, overrideHeaders, onEnd });
  } catch (error) {
    if (error instanceof AbortError) {
      log.warn(`Request aborted after ${error.duration} ms: ${error.message}`, traceId, spanId, {
        error: error.message,
        duration: error.duration,
      });

      return new Response(JSON.stringify({ message: 'Request aborted by client' }), { status: 499 }); // Will never be received by client
    }

    if (error instanceof TimeoutError) {
      log.warn(`Request timed out: ${error.message}`, traceId, spanId, {
        duration: error.duration,
        timeout: error.timeout,
      });

      return new Response(JSON.stringify({ message: 'Upstream request timed out' }), { status: 504 });
    }

    if (error instanceof ProxyError) {
      log.error(`Proxy error after ${error.duration} ms: ${error.message}`, traceId, spanId, {
        error: error.message,
        duration: error.duration,
      });

      return new Response(JSON.stringify({ message: 'Upstream request failed', details: error.message }), {
        status: 502,
      });
    }

    if (error instanceof Error) {
      log.error(`Proxy error: ${error.message}`, traceId, spanId, { error: error.message });

      return new Response(JSON.stringify({ message: 'Upstream request failed', details: error.message }), {
        status: 502,
      });
    }

    log.error('Proxy error: Unknown error', traceId, spanId, { error: 'Unknown error' });

    return new Response(JSON.stringify({ message: 'Upstream request failed', details: 'Unknown error' }), {
      status: 502,
    });
  }
}
