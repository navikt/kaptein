import http, { type IncomingMessage, type OutgoingHttpHeaders } from 'node:http';
import https from 'node:https';
import { isLocal } from '@/lib/environment';
import { AppName, getOboToken } from '@/lib/server/get-obo-token';

export const dynamic = 'force-dynamic';

const KAPTEIN_URL = isLocal
  ? new URL('https://kaptein.intern.dev.nav.no/api/behandlinger')
  : new URL('http://kaptein-api/behandlinger');

export async function GET(request: Request, ctx: RouteContext<'/api/behandlinger/[status]'>): Promise<Response> {
  const { status } = await ctx.params;

  if (!isStatus(status)) {
    return new Response('Not found', { status: 404 });
  }

  const token = await getOboToken(AppName.KAPTEIN_API, request.headers);

  const requestHeaders: OutgoingHttpHeaders = {
    ...Object.fromEntries([...request.headers.entries()]),
    authorization: `Bearer ${token}`,
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
        while (true) {
          const { done, value } = await res.read();

          if (done) {
            break;
          }

          controller.enqueue(value);
        }

        controller.close();
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
  return new Promise<IncomingMessage>((resolve, reject) => {
    const fn = url.protocol === 'http:' ? http.request : https.request;

    const req = fn(KAPTEIN_URL, { method: 'GET', headers }, resolve);

    req.once('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.once('error', reject);
  });
};

enum Status {
  LEDIGE = 'ledige',
  TILDELTE = 'tildelte',
  FERDIGSTILTE = 'ferdigstilte',
}

const STATUS_LIST = Object.values(Status);

const isStatus = (status: string): status is Status => STATUS_LIST.includes(status as Status);
