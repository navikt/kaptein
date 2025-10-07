interface TraceParent {
  traceparent: string;
  traceId: string;
  spanId: string;
}

export const getTraceparent = (incomingHeaders: Headers): TraceParent => {
  const traceparent = incomingHeaders.get('traceparent');

  return traceparent === null ? generateTraceParent() : parseTraceParent(traceparent);
};

const TRACE_VERSION = '00';
const TRACE_FLAGS = '00';

/** Generates a traceparent ID according to https://www.w3.org/TR/trace-context/#version-format */
export const generateTraceParent = (): TraceParent => {
  const traceId = getUuid();
  const spanId = generateSpanId(); // parent_id

  return {
    traceparent: `${TRACE_VERSION}-${traceId}-${spanId}-${TRACE_FLAGS}`,
    traceId,
    spanId,
  };
};

export const generateTraceId = (): string => getUuid();

export const generateSpanId = (): string => getUuid().substring(0, 16);

const getUuid = () => crypto.randomUUID().replaceAll('-', '');

export const parseTraceParent = (traceparent: string): TraceParent => {
  const [_, traceId, spanId, __] = traceparent.split('-');

  if (traceId === undefined || spanId === undefined) {
    return generateTraceParent();
  }

  return { traceparent, traceId, spanId };
};
