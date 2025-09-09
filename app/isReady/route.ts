import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';

export function GET() {
  if (!BEHANDLINGER_DATA_LOADER.isInitialized()) {
    return new Response('Behandlinger dataloader is not initialized', { status: 503 });
  }

  if (!BEHANDLINGER_DATA_LOADER.isReady()) {
    return new Response('Behandling dataloader is not ready...', { status: 202 });
  }

  return new Response('I am ready!', {
    status: 200,
    headers: { 'content-type': 'text/plain' },
  });
}
