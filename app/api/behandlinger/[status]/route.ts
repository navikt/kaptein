import http, { type IncomingMessage, type OutgoingHttpHeaders } from 'node:http';
import https from 'node:https';
import { isLocal } from '@/lib/environment';

export const dynamic = 'force-dynamic';

const KAPTEIN_URL = new URL('https://kaptein-api.intern.dev.nav.no/behandlinger');

// TODO: Use this.
const USE_THIS = isLocal
  ? new URL('https://kaptein.intern.dev.nav.no/api/behandlinger')
  : new URL('http://kaptein-api/behandlinger');

export async function GET(request: Request, ctx: RouteContext<'/api/behandlinger/[status]'>): Promise<Response> {
  const { status } = await ctx.params;

  if (!isStatus(status)) {
    return new Response('Not found', { status: 404 });
  }

  // const token = await getOboToken(AppName.KAPTEIN_API, request.headers);

  const requestHeaders: OutgoingHttpHeaders = {
    ...Object.fromEntries([...request.headers.entries()]),
    // authorization: `Bearer ${token}`,
    accept: 'application/json',
    host: KAPTEIN_URL.host,
  };

  const url = new URL(KAPTEIN_URL);
  url.pathname += `/${status}`;

  const res = await customFetch(url, requestHeaders);

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

  return new Response(
    new ReadableStream({
      async start(controller) {
        res.once('readable', async () => {
          console.debug('Response is readable');

          while (true) {
            const { done, value } = await res.read();

            if (done) {
              console.debug('Stream is done');
              break;
            }

            console.debug(`Enqueuing ${value?.length} bytes`);
            controller.enqueue(value);
          }
        });

        res.once('end', () => {
          console.debug('Response ended');
          controller.close();
        });
        res.once('error', (err) => {
          console.error('Response error', err);
          controller.error(err);
        });
        res.once('close', () => {
          console.warn('Response closed');
          controller.error(new Error('Connection closed'));
        });
      },
    }),
    {
      status: res.statusCode,
      headers,
      statusText: res.statusMessage,
    },
  );
}

const customFetch = async (url: URL, headers: OutgoingHttpHeaders) => {
  console.debug(`Fetching ${url.href}`, headers);

  const start = performance.now();

  return new Promise<IncomingMessage>((resolve, reject) => {
    const fn = url.protocol === 'http:' ? http.request : https.request;

    const req = fn(KAPTEIN_URL, { method: 'GET', headers, timeout: 500 }, resolve);

    req.once('timeout', () => {
      req.destroy();
      reject(new Error(`Request timed out after ${Math.round(performance.now() - start)} ms`));
    });

    req.once('error', (err) => {
      console.error(`Error fetching ${url.href} after ${Math.round(performance.now() - start)} ms`, err);
      reject(err);
    });

    req.end();
  });
};

enum Status {
  LEDIGE = 'ledige',
  TILDELTE = 'tildelte',
  FERDIGSTILTE = 'ferdigstilte',
}

const STATUS_LIST = Object.values(Status);

const isStatus = (status: string): status is Status => STATUS_LIST.includes(status as Status);
