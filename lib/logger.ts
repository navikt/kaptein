import { trace } from '@opentelemetry/api';
import { VERSION } from '@/lib/version';

enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

type JsonValue = string | number | boolean | null | undefined | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

type LoggerFn = (message: string, eventData?: JsonObject) => void;

interface TraceContext {
  traceId: string | undefined;
  spanId: string | undefined;
}

const getTraceContext = (): TraceContext => {
  const span = trace.getActiveSpan();

  if (span === undefined) {
    return { traceId: undefined, spanId: undefined };
  }

  const { traceId, spanId } = span.spanContext();

  return { traceId, spanId };
};

export const getLogger = (module: string, defaultEventData?: JsonObject) => ({
  debug: getLogLine(LogLevel.DEBUG, module, defaultEventData),
  info: getLogLine(LogLevel.INFO, module, defaultEventData),
  warn: getLogLine(LogLevel.WARN, module, defaultEventData),
  error: getLogLine(LogLevel.ERROR, module, defaultEventData),
});

type GetLogLineFn = (level: LogLevel, module: string, defaultEventData?: JsonObject) => LoggerFn;

const getLogLine: GetLogLineFn = (level, module, defaultEventData) => (message, eventData) => {
  const { traceId, spanId } = getTraceContext();

  // biome-ignore lint/suspicious/noConsole: Console needed
  console[level](
    JSON.stringify({
      ...defaultEventData,
      ...eventData,
      level,
      module,
      message,
      trace_id: traceId,
      span_id: spanId,
      version: VERSION,
      '@timestamp': timestamp(),
    }),
  );
};

const timestamp = () => new Date().toISOString();
