import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getUser } from '@/lib/server/api';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const saker = await getUser();

    return Response.json(saker);
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
