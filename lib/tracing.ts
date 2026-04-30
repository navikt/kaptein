import { type Span, SpanStatusCode } from '@opentelemetry/api';

const toError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  try {
    return new Error(String(error));
  } catch {
    return new Error('Unknown error');
  }
};

export const recordSpanError = (span: Span, error: unknown): void => {
  const err = toError(error);
  span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
  span.recordException(err);
};
