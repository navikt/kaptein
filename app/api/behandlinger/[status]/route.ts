import http, { type IncomingMessage, type OutgoingHttpHeaders } from 'node:http';
import https from 'node:https';
import type { NextRequest } from 'next/server';
import { isDeployed, isLocal } from '@/lib/environment';
import { getLogger } from '@/lib/logger';
import { AppName, getOboToken } from '@/lib/server/get-obo-token';
import { generateTraceParent, parseTraceParent } from '@/lib/server/traceparent';

const log = getLogger('behandlinger-proxy');

export const dynamic = 'force-dynamic';

const KAPTEIN_URL = isLocal
  ? new URL('https://kaptein-api.intern.dev.nav.no/behandlinger')
  : new URL('http://kaptein-api/behandlinger');

const request = isLocal ? https.request : http.request;

export async function GET(req: NextRequest, ctx: RouteContext<'/api/behandlinger/[status]'>): Promise<Response> {
  const incomingTraceparent = req.headers.get('traceparent');

  const { traceparent, traceId, spanId } =
    incomingTraceparent === null ? generateTraceParent() : parseTraceParent(incomingTraceparent);

  const { status } = await ctx.params;

  const url = new URL(KAPTEIN_URL);

  url.pathname += `/${status}`;

  const requestHeaders: OutgoingHttpHeaders = {
    connection: 'keep-alive',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    'user-agent': req.headers.get('user-agent') ?? 'kaptein-proxy',
    'accept-encoding': req.headers.get('accept-encoding') ?? 'gzip, deflate, br',
    accept: 'application/json',
    host: url.host,
    traceparent,
  };

  if (isDeployed) {
    const token = await getOboToken(AppName.KAPTEIN_API, req.headers);
    requestHeaders.authorization = `Bearer ${token}`;
    requestHeaders.cookie = req.headers.get('cookie') ?? undefined;
  }

  try {
    const res = await proxyRequest(url, requestHeaders, req.signal);

    const headers = new Headers();

    for (const [key, value] of Object.entries(res.headers)) {
      if (value === undefined) {
        continue;
      }

      if (Array.isArray(value)) {
        headers.set(key, value.join(','));
      } else {
        headers.set(key, value);
      }
    }

    let bytes = 0;

    return new Response(
      new ReadableStream({
        async start(controller) {
          res.on('data', (chunk) => {
            bytes += chunk.length;
            controller.enqueue(chunk);
          });

          res.once('end', () => {
            log.debug(
              `Proxied ${formatBytes(bytes)} from ${req.method} ${url.href} (${res.headers['content-type']} - ${res.headers['content-encoding']})`,
              traceId,
              spanId,
            );
            controller.close();
          });

          res.once('error', (error) => {
            log.error(`Response error: ${error.message}`, traceId, spanId, { error: error.message });
            controller.error(error);
          });

          res.resume(); // Ensure the stream is not paused.
        },
      }),
      {
        status: res.statusCode,
        headers,
        statusText: res.statusMessage,
      },
    );
  } catch (error) {
    if (error instanceof TimeoutError) {
      log.warn(
        `Timeout after ${error.duration} ms (limit: ${error.timeout} ms) for ${req.method} ${url.href}`,
        traceId,
        spanId,
      );
      return new Response(JSON.stringify({ message: 'Upstream request timed out' }), { status: 504 });
    }

    if (error instanceof AbortError) {
      log.warn(`Request aborted by client for ${req.method} ${url.href}`, traceId, spanId);
      return new Response(JSON.stringify({ message: 'Request aborted by client' }), { status: 499 });
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

const proxyRequest = async (
  url: URL,
  headers: OutgoingHttpHeaders,
  abortSignal: AbortSignal,
  timeout = 500,
): Promise<IncomingMessage> => {
  const start = performance.now();

  return new Promise<IncomingMessage>((resolve, reject) => {
    const req = request(url, { method: 'GET', headers, timeout }, resolve);

    abortSignal.addEventListener('abort', () => {
      req.destroy();
      reject(new AbortError('Request aborted by client'));
    });

    req.once('timeout', () => {
      req.destroy();
      const duration = Math.round(performance.now() - start);
      reject(new TimeoutError(`Request timed out after ${duration} ms`, duration, timeout));
    });

    req.once('error', reject);

    req.end();
  });
};

class TimeoutError extends Error {
  constructor(
    message: string,
    public duration: number,
    public timeout: number,
  ) {
    super(message);
    this.name = 'TimeoutError';
  }
}

class AbortError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AbortError';
  }
}

const k = 1000;
const sizes = ['bytes', 'kB', 'MB', 'GB', 'TB'];

const formatBytes = (bytes: number): string => {
  if (bytes === 0) {
    return '0 bytes';
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / k ** i).toFixed(2)} ${sizes[i]}`;
};
