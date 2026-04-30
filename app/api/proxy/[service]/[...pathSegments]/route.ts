import { SpanStatusCode, trace } from '@opentelemetry/api';
import type { NextRequest } from 'next/server';
import { isAppName } from '@/lib/app-name';
import { isDeployed } from '@/lib/environment';
import { formatBytes } from '@/lib/format-bytes';
import { getLogger } from '@/lib/logger';
import { SERVICE_URLS } from '@/lib/server/api';
import { getOboToken } from '@/lib/server/get-obo-token';
import { AbortError, ProxyError, TimeoutError } from '@/lib/server/proxy/errors';
import { type EndInfo, handleProxyRequest } from '@/lib/server/proxy/proxy';
import { recordSpanError } from '@/lib/tracing';

const log = getLogger('proxy');

const tracer = trace.getTracer('kaptein');

export const dynamic = 'force-dynamic';

const handler = async (
  req: NextRequest,
  ctx: RouteContext<'/api/proxy/[service]/[...pathSegments]'>,
): Promise<Response> => {
  const { service, pathSegments } = await ctx.params;

  if (!isAppName(service)) {
    const message = `Invalid service name "${service}" in path "${req.nextUrl.pathname}"`;
    log.error(message, { service });
    return new Response(JSON.stringify({ message }), { status: 404 });
  }

  const path = pathSegments.join('/');
  const url = SERVICE_URLS[service]({ path, searchParams: req.nextUrl.searchParams });

  return tracer.startActiveSpan(`proxy ${req.method} ${service}/${path}`, async (span) => {
    span.setAttribute('http.method', req.method);
    span.setAttribute('http.url', url.toString());
    span.setAttribute('proxy.service', service);
    span.setAttribute('proxy.path', path);

    try {
      const authorization = isDeployed ? `Bearer ${await getOboToken(service, req.headers)}` : undefined;

      const onEnd = ({ bytes, duration, status }: EndInfo) => {
        span.setAttribute('http.status_code', status ?? 0);
        span.setAttribute('proxy.bytes', bytes);
        span.setAttribute('proxy.duration_ms', duration);
        span.setStatus({ code: SpanStatusCode.OK });
        span.end();

        log.info(
          `Proxied ${req.method} ${service}/${path} - ${formatBytes(bytes)} in ${duration} ms - status: ${status ?? 'NONE'}`,
          { status, method: req.method, service, path, bytes, duration, url: url.toString() },
        );
      };

      return handleProxyRequest(req, { targetUrl: url, authorization, onEnd });
    } catch (error) {
      recordSpanError(span, error);
      span.end();

      if (error instanceof AbortError) {
        log.warn(`Request aborted after ${error.duration} ms: ${error.message}`, {
          error: error.message,
          duration: error.duration,
        });

        return new Response(JSON.stringify({ message: 'Request aborted by client' }), { status: 499 });
      }

      if (error instanceof TimeoutError) {
        log.warn(`Request timed out: ${error.message}`, {
          duration: error.duration,
          timeout: error.timeout,
        });

        return new Response(JSON.stringify({ message: 'Upstream request timed out' }), { status: 504 });
      }

      if (error instanceof ProxyError) {
        log.error(`Proxy error after ${error.duration} ms: ${error.message}`, {
          error: error.message,
          duration: error.duration,
        });

        return new Response(JSON.stringify({ message: 'Upstream request failed', details: error.message }), {
          status: 502,
        });
      }

      if (error instanceof Error) {
        log.error(`Proxy error: ${error.message}`, { error: error.message });

        return new Response(JSON.stringify({ message: 'Upstream request failed', details: error.message }), {
          status: 502,
        });
      }

      log.error('Proxy error: Unknown error', { error: 'Unknown error' });

      return new Response(JSON.stringify({ message: 'Upstream request failed', details: 'Unknown error' }), {
        status: 502,
      });
    }
  });
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const HEAD = handler;
export const OPTIONS = handler;
