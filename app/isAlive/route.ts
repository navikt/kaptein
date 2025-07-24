export function GET() {
  return new Response('I am alive!', {
    status: 200,
    headers: { 'content-type': 'text/plain' },
  });
}
