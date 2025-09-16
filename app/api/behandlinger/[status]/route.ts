import { isLocal } from '@/lib/environment';
import { AppName, getOboToken } from '@/lib/server/get-obo-token';

export const dynamic = 'force-dynamic';

const URL = isLocal ? 'https://kaptein.intern.dev.nav.no/api/behandlinger' : 'http://kaptein-api/behandlinger';

export async function GET(request: Request, ctx: RouteContext<'/api/behandlinger/[status]'>): Promise<Response> {
  const { status } = await ctx.params;

  if (!isStatus(status)) {
    return new Response('Not found', { status: 404 });
  }

  const token = await getOboToken(AppName.KAPTEIN_API, request.headers);

  const { headers } = request;

  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Accept-Encoding', 'identity');

  const res = await fetch(URL, { method: 'GET', headers });

  if (res.body === null) {
    return res;
  }

  const reader = res.body.getReader();

  return new Response(
    new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          controller.enqueue(value);
        }

        controller.close();
        reader.releaseLock();
      },
    }),
    {
      status: res.status,
      headers: res.headers,
      statusText: res.statusText,
    },
  );
}

enum Status {
  LEDIGE = 'ledige',
  TILDELTE = 'tildelte',
  FERDIGSTILTE = 'ferdigstilte',
}

const STATUS_LIST = Object.values(Status);

const isStatus = (status: string): status is Status => STATUS_LIST.includes(status as Status);
