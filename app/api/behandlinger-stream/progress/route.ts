import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { BEHANDLINGER_DATA_LOADER } from '@/lib/server/behandlinger';

export const dynamic = 'force-dynamic';

export interface StreamProgressEvent {
  count: number;
  total: number | null;
  progress: number;
}

export async function GET(request: Request) {
  try {
    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      start(controller) {
        // Initial data or setup
        controller.enqueue(
          encoder.encode(
            format({
              count: BEHANDLINGER_DATA_LOADER.getCount(),
              total: BEHANDLINGER_DATA_LOADER.getTotal(),
              progress: BEHANDLINGER_DATA_LOADER.progress(),
            }),
          ),
        );

        const removeListener = BEHANDLINGER_DATA_LOADER.addProgressListener((count, total, progress) => {
          const message = format({ count, total, progress });
          controller.enqueue(encoder.encode(message));
        });

        // Handle client disconnection (optional, but good practice)
        request.signal.onabort = () => {
          removeListener();
          controller.close();
          console.debug('Client disconnected');
        };
      },
      cancel() {
        console.debug('Stream cancelled');
      },
    });

    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
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

const format = (event: StreamProgressEvent) => `event: progress\ndata: ${JSON.stringify(event)}\n\n`;
