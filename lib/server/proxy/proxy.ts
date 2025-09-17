import http, { type IncomingMessage, type OutgoingHttpHeaders } from 'node:http';
import https from 'node:https';
import { getLogger } from '@/lib/logger';
import { AbortError, ProxyError, TimeoutError } from '@/lib/server/proxy/errors';
import { getResponseHeaders, prepareProxyHeaders } from '@/lib/server/proxy/headers';

const log = getLogger('behandlinger-proxy');

export interface EndInfo {
  bytes: number;
  duration: number;
}

interface TargetOptions {
  targetUrl: URL | string;
  method?: string;
  timeout?: number;
  overrideHeaders?: OutgoingHttpHeaders;
  onEnd?: (info: EndInfo) => void;
  traceId: string;
  spanId: string;
}

export const handleProxyRequest = async (
  req: Request,
  { targetUrl, method = 'GET', timeout = 0, overrideHeaders, onEnd, traceId, spanId }: TargetOptions,
): Promise<Response> => {
  const url = typeof targetUrl === 'string' ? new URL(targetUrl) : targetUrl;
  const request = url.protocol === 'https:' || url.protocol === 'wss:' ? https.request : http.request;
  log.debug(`Preparing headers for ${method} ${url.href}`, traceId, spanId);
  const requestHeaders = prepareProxyHeaders(url, req, overrideHeaders);

  const start = performance.now();

  const res = await getProxyResponse(request, req, method, url, requestHeaders, req.signal, timeout);
  log.debug(`Received response for ${method} ${url.href}`, traceId, spanId);

  const headers = getResponseHeaders(res);

  let bytes = 0; // Counter for bytes proxied.

  log.debug(`Sending response from ${method} ${url.href} (${res.statusCode})`, traceId, spanId);

  return new Response(
    new ReadableStream({
      async start(controller) {
        res.on('data', (chunk) => {
          bytes += chunk.length;
          controller.enqueue(chunk);
        });

        res.once('end', () => {
          controller.close();
          onEnd?.({ bytes, duration: performance.now() - start });
        });

        res.once('error', (error) => {
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
};

const getProxyResponse = async (
  request: typeof http.request | typeof https.request,
  req: Request,
  method: string,
  url: URL,
  headers: OutgoingHttpHeaders,
  abortSignal: AbortSignal,
  timeout: number,
): Promise<IncomingMessage> => {
  const start = performance.now();

  return new Promise<IncomingMessage>((resolve, reject) => {
    const proxyReq = request(url, { method, headers, timeout }, resolve);

    if (req.body !== null) {
      // Copy request body to proxy request.
      writeStream(proxyReq, req.body);
    }

    abortSignal.addEventListener('abort', () => {
      proxyReq.destroy();
      reject(new AbortError('Request aborted by client', getDuration(start)));
    });

    proxyReq.once('timeout', () => {
      proxyReq.destroy();
      const duration = getDuration(start);
      reject(new TimeoutError(`Request timed out after ${duration} ms`, duration, timeout));
    });

    proxyReq.once('error', (error) => {
      reject(new ProxyError(`Proxy error: ${error.message}`, getDuration(start), error));
    });
  });
};

const writeStream = async (proxyReq: http.ClientRequest, body: ReadableStream<Uint8Array>) => {
  const reader = body.getReader();

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    proxyReq.write(value);
  }

  const { value } = await reader.read();
  proxyReq.end(value);
};

const getDuration = (start: number) => Math.round(performance.now() - start);
