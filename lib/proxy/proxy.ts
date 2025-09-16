import http, { type IncomingMessage, type OutgoingHttpHeaders } from 'node:http';
import https from 'node:https';
import type { NextRequest } from 'next/server';
import { AbortError, ProxyError, TimeoutError } from '@/lib/proxy/errors';
import { getResponseHeaders, prepareProxyHeaders } from '@/lib/proxy/headers';

export interface EndInfo {
  bytes: number;
  duration: number;
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface TargetOptions {
  targetUrl: URL | string;
  method?: Method;
  timeout?: number;
  overrideHeaders?: OutgoingHttpHeaders;
  onEnd?: (info: EndInfo) => void;
}

export const handleProxyRequest = async (
  req: NextRequest,
  { targetUrl, method = 'GET', timeout = 30_000, overrideHeaders, onEnd }: TargetOptions,
): Promise<Response> => {
  const url = typeof targetUrl === 'string' ? new URL(targetUrl) : targetUrl;
  const request = url.protocol === 'https:' ? https.request : http.request;
  const requestHeaders = prepareProxyHeaders(url, req, overrideHeaders);

  const start = performance.now();

  const res = await getProxyResponse(request, req, method, url, requestHeaders, req.signal, timeout);

  const headers = getResponseHeaders(res);

  let bytes = 0; // Counter for bytes proxied.

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
  req: NextRequest,
  method: Method,
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
      reject(new ProxyError(`Proxy error: ${error.message}`, getDuration(start)));
    });

    proxyReq.end();
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
};

const getDuration = (start: number) => Math.round(performance.now() - start);
