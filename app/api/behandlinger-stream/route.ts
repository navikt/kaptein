import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getResponse } from '@/lib/server/api';
import { AppName } from '@/lib/server/get-obo-token';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await getResponse(AppName.KABAL_API, '/behandlinger-stream');

    return new Response(res.body, { headers: res.headers, status: res.status, statusText: res.statusText });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return new Response(error.message, { status: 401 });
    }

    if (error instanceof InternalServerError) {
      return new Response(error.message, { status: 500 });
    }

    return new Response('Ukjent feil', { status: 500 });
  }
}
