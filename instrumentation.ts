import { getLogger } from '@/lib/logger';
import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';
import { generateTraceParent } from '@/lib/server/traceparent';

const log = getLogger('next-instrumentation');

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('pino');
  }

  const { traceId, spanId } = generateTraceParent();

  try {
    const removeProgressListener = BEHANDLINGER_DATA_LOADER.addInitProgressListener((count, total, progress) => {
      log.info(
        `${BEHANDLINGER_DATA_LOADER.name} DataLoader progress: ${progress.toFixed(2)}% (${count}/${total})`,
        traceId,
        spanId,
      );
    });

    await BEHANDLINGER_DATA_LOADER.init();

    removeProgressListener();
  } catch (error) {
    if (error instanceof Error) {
      log.error(`Error initializing data loaders: ${error.message}`, traceId, spanId);
    } else {
      log.error('Error initializing data loaders: Unknown error', traceId, spanId);
    }
  }
}
