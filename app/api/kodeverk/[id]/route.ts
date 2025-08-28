import type { NextRequest } from 'next/server';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getKodeverk } from '@/lib/server/api';
export const dynamic = 'force-dynamic';

interface Params {
  id: string;
}

export async function GET(_req: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params;

  console.log(id);
  console.log(id);
  console.log(id);
  console.log(id);
  console.log(id);

  try {
    const saker = await getKodeverk(id);

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
