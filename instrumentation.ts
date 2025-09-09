import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('pino');
  }

  await BEHANDLINGER_DATA_LOADER.init();
}
