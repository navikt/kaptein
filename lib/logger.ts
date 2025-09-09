import { VERSION } from '@/lib/version';

enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

type JsonValue = string | number | bigint | boolean | null | undefined | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

type LoggerFn = (message: string, traceId: string, spanId: string, eventData?: JsonObject) => void;

export const getLogger = (module: string) => ({
  debug: getLogLine(LogLevel.DEBUG, module),
  info: getLogLine(LogLevel.INFO, module),
  warn: getLogLine(LogLevel.WARN, module),
  error: getLogLine(LogLevel.ERROR, module),
});

type GetLogLineFn = (level: LogLevel, module: string) => LoggerFn;

const getLogLine: GetLogLineFn = (level, module) => (message, traceId, spanId, eventData) =>
  // biome-ignore lint/suspicious/noConsole: Console needed
  console[level](
    JSON.stringify({
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

const timestamp = () => new Date().toISOString();
