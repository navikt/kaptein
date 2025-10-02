import type { OutgoingHttpHeaders } from 'node:http';
import type { NextRequest } from 'next/server';
import { isDeployed } from '@/lib/environment';
import { formatBytes } from '@/lib/format-bytes';
import { getLogger } from '@/lib/logger';
import { SERVICE_URLS } from '@/lib/server/api';
import { getOboToken, isAppName } from '@/lib/server/get-obo-token';
import { AbortError, ProxyError, TimeoutError } from '@/lib/server/proxy/errors';
import { type EndInfo, handleProxyRequest } from '@/lib/server/proxy/proxy';
import { generateTraceParent, parseTraceParent } from '@/lib/server/traceparent';

const log = getLogger('proxy');

export const dynamic = 'force-dynamic';

const handler = async (
  req: NextRequest,
  ctx: RouteContext<'/api/proxy/[service]/[...pathSegments]'>,
): Promise<Response> => {
  const incomingTraceparent = req.headers.get('traceparent');
  const { traceparent, traceId, spanId } =
    incomingTraceparent === null ? generateTraceParent() : parseTraceParent(incomingTraceparent);

  const { service, pathSegments } = await ctx.params;

  if (!isAppName(service)) {
    const message = `Invalid service name "${service}" in path "${req.nextUrl.pathname}"`;
    log.error(message, traceId, spanId, { service });
    return new Response(JSON.stringify({ message }), { status: 404 });
  }

  const path = pathSegments.join('/');

  const url = SERVICE_URLS[service]({ path, searchParams: req.nextUrl.searchParams });

  log.debug(`Proxying ${req.method} ${service}/${path}`, traceId, spanId, {
    method: req.method,
    service,
    path,
    url: url.toString(),
  });

  const overrideHeaders: OutgoingHttpHeaders = { traceparent };

  if (isDeployed) {
    const token = await getOboToken(service, req.headers);
    overrideHeaders.authorization = `Bearer ${token}`;
  }

  const onEnd = ({ bytes, duration, status }: EndInfo) =>
    log.info(
      `Proxied ${req.method} ${service}/${path} - ${formatBytes(bytes)} in ${duration} ms - status: ${status ?? 'NONE'}`,
      traceId,
      spanId,
      { status, method: req.method, service, path, bytes, duration, url: url.toString() },
    );

  try {
    return handleProxyRequest(req, { targetUrl: url, overrideHeaders, onEnd });
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
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
