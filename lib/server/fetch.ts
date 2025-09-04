import { AppName, getOboToken } from '@/lib/server/get-obo-token';

export const getFromKabal = async (
  appName: AppName,
  url: string,
  incomingHeaders: Headers,
  traceparent: string,
): ReturnType<typeof fetch> => {
  const token = await getOboToken(appName, incomingHeaders);

  const headers: HeadersInit = appName === AppName.KABAL_INNSTILLINGER ? { authorization: `Bearer ${token}` } : {};

  if (traceparent !== undefined) {
    headers.traceparent = traceparent;
  }

  return await fetch(url, { method: 'GET', headers });
};

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
  const spanId = getUuid().substring(0, 16); // parent_id

  return {
    traceparent: `${TRACE_VERSION}-${traceId}-${spanId}-${TRACE_FLAGS}`,
    traceId,
    spanId,
  };
};

const getUuid = () => crypto.randomUUID().replaceAll('-', '');

const parseTraceParent = (traceparent: string): TraceParent => {
  const [_, traceId, spanId, __] = traceparent.split('-');

  return { traceparent, traceId, spanId };
};
