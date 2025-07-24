import { register } from 'prom-client';

export const revalidate = 0;

export async function GET() {
  const metrics = await register.metrics();

  return new Response(metrics, {
    status: 200,
    headers: { 'content-type': register.contentType },
  });
}
