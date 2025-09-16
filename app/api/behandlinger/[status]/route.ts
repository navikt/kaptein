import { proxyRouteHandler } from '@navikt/next-api-proxy';
import { isLocal } from '@/lib/environment';
import { AppName, getOboToken } from '@/lib/server/get-obo-token';

const hostname = isLocal ? 'kaptein.intern.dev.nav.no' : 'kaptein-api';
const behandlingerPath = isLocal ? '/api/behandlinger' : '/behandlinger';

export async function GET(request: Request, ctx: RouteContext<'/api/behandlinger/[status]'>): Promise<Response> {
  const { status } = await ctx.params;

  if (!isStatus(status)) {
    return new Response('Not found', { status: 404 });
  }

  const bearerToken = await getOboToken(AppName.KAPTEIN_API, request.headers);

  const res = await proxyRouteHandler(request, {
    hostname,
    path: `${behandlingerPath}/${status}`,
    bearerToken,
    https: isLocal,
  });

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
