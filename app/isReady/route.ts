export function GET() {
  return new Response('I am ready!', {
    status: 200,
    headers: { 'content-type': 'text/plain' },
  });
}
