import { afterAll, beforeAll, describe, expect, mock, test } from 'bun:test';
import { afterEach } from 'node:test';
import { ProxyError, TimeoutError } from '@/lib/server/proxy/errors';
import { type EndInfo, handleProxyRequest } from '@/lib/server/proxy/proxy';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const REMOTE_URL = new URL('http://localhost:2345');
const PROXY_URL = new URL('http://localhost:3456');

describe('Proxy Server', () => {
  let remoteServer: ReturnType<typeof Bun.serve>;
  let proxyServer: ReturnType<typeof Bun.serve>;

  const handlerFn = mock(
    (_headers: Headers, _body: ReadableStream<Uint8Array<ArrayBufferLike>> | null): void => undefined,
  );

  afterEach(() => {
    handlerFn.mockClear();
  });

  test('should proxy GET JSON requests', async () => {
    const response = await fetch(`${PROXY_URL}/test`, { method: 'GET' });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'Hello from remote server!' });
    expect(handlerFn).toHaveBeenCalled();
  });

  test('should proxy POST JSON requests', async () => {
    const response = await fetch(`${PROXY_URL}/test`, {
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'Hello from remote server!' });
    const [firstCall] = handlerFn.mock.calls;
    if (firstCall === undefined) {
      throw new Error('Handler function was not called');
    }
    const [headers, body] = firstCall;
    expect(headers.get('content-type')).toBe('application/json');
    expect(body).not.toBeNull();
  });

  test('should handle 404 responses', async () => {
    const response = await fetch(`${PROXY_URL}/not-found`, { method: 'GET' });

    expect(response.status).toBe(404);
    expect(handlerFn).toHaveBeenCalled();
  });

  test('should handle proxy timeouts when set', async () => {
    const delay = 20;
    const timeout = 10;

    expect.assertions(2);

    const res = await fetch(`${PROXY_URL}/test`, {
      method: 'GET',
      headers: { 'x-delay': delay.toString(10), 'x-timeout': timeout.toString(10) },
    });

    expect(res.status).toBe(504);
    expect(handlerFn).toHaveBeenCalled();
  });

  test('should proxy with custom headers', async () => {
    const response = await fetch(new Request(`${REMOTE_URL}/test`), {
      headers: { 'X-Custom-Header': 'CustomValue' },
    });

    expect(response.status).toBe(200);
    expect(handlerFn).toHaveBeenCalledTimes(1);
    const [firstCall] = handlerFn.mock.calls;
    if (firstCall === undefined) {
      throw new Error('Handler function was not called');
    }
    const [headers, body] = firstCall;
    expect(headers.get('X-Custom-Header')).toBe('CustomValue');
    expect(body).toBeNull();
  });

  test('should handle upstream server errors', async () => {
    const response = await fetch(`${PROXY_URL}/error`, { method: 'GET' });

    expect(response.status).toBe(500);
    expect(handlerFn).toHaveBeenCalled();
  });

  test('should handle SSE requests', async () => {
    const response = await fetch(`${PROXY_URL}/sse`, {
      method: 'GET',
      headers: { Accept: 'text/event-stream' },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/event-stream');
    expect(handlerFn).toHaveBeenCalled();

    if (response.body === null) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const receivedMessages = [];

    while (receivedMessages.length < 5) {
      // eslint-disable-next-line no-await-in-loop
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      const chunk = new TextDecoder().decode(value);
      const dataLine = chunk.split('\n').find((line) => line.startsWith('data:'));
      const data = dataLine !== undefined ? dataLine.replace('data: ', '').trim() : null;
      const parsedData = data !== null ? Number.parseInt(data, 10) : null;

      if (parsedData !== null) {
        receivedMessages.push(parsedData);
      }
    }

    expect(receivedMessages).toEqual([1, 2, 3, 4, 5]);
  });

  /**
   * Before and after all to set up and tear down the "remote" and "proxy" servers.
   */

  beforeAll(() => {
    remoteServer = Bun.serve({
      port: REMOTE_URL.port,
      fetch: async (req) => {
        const url = URL.parse(req.url);

        if (url === null) {
          return new Response('Bad Request', { status: 400 });
        }

        // Call the handler function to simulate processing
        handlerFn(req.headers, req.body);

        const delayHeader = req.headers.get('x-delay');
        const parsedDelayHeader = delayHeader === null ? 0 : Number.parseInt(delayHeader, 10);
        const delayInMs = Number.isNaN(parsedDelayHeader) ? 0 : parsedDelayHeader;

        if (delayInMs > 0) {
          await delay(delayInMs); // Simulate processing delay
        }

        // Handle regular HTTP requests
        switch (url.pathname) {
          case '/test': {
            return new Response(JSON.stringify({ message: 'Hello from remote server!' }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
          case '/sse': {
            return new Response(
              new ReadableStream({
                start(controller) {
                  let count = 0;

                  const interval = setInterval(() => {
                    count += 1;
                    controller.enqueue(`event: test\ndata: ${count}\n\n`);

                    if (count >= 5) {
                      clearInterval(interval);
                      controller.close();
                    }
                  }, 100);
                },
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
              },
            );
          }
          case '/error': {
            return new Response('Internal Server Error on the remote server', { status: 500 });
          }
          default: {
            return new Response('Not Found on remote server', { status: 404 });
          }
        }
      },
    });

    proxyServer = Bun.serve({
      port: PROXY_URL.port,
      fetch: async (req) => {
        const url = URL.parse(req.url);

        if (url === null) {
          // URL is not parsable
          return new Response('Bad Request', { status: 400 });
        }

        url.port = '2345'; // Redirect to remote server port

        const onEnd = ({ bytes, duration }: EndInfo) =>
          console.info(`Proxy server: Proxied ${bytes} bytes in ${duration.toFixed(2)} ms`);

        const timeoutHeader = req.headers.get('x-timeout');
        const parsedTimeoutHeader = timeoutHeader === null ? 0 : Number.parseInt(timeoutHeader, 10);
        const timeout = Number.isNaN(parsedTimeoutHeader) ? 0 : parsedTimeoutHeader;

        try {
          return await handleProxyRequest(req, {
            targetUrl: url,
            method: req.method,
            timeout,
            onEnd,
          });
        } catch (error) {
          if (error instanceof TimeoutError) {
            return new Response(JSON.stringify({ message: 'Upstream request timed out' }), { status: 504 });
          }

          if (error instanceof ProxyError) {
            return new Response(JSON.stringify({ message: 'Upstream request failed', details: error.message }), {
              status: 502,
            });
          }

          if (error instanceof Error) {
            return new Response(JSON.stringify({ message: 'Upstream request failed', details: error.message }), {
              status: 502,
            });
          }

          return new Response(JSON.stringify({ message: 'Upstream request failed', details: 'Unknown error' }), {
            status: 502,
          });
        }
      },
    });
  });

  afterAll(() => {
    remoteServer.stop();
    proxyServer.stop();
  });
});
