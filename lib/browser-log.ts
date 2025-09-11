import { isClient } from '@/lib/environment';

const NOOP = () => undefined;

console.log('isClient:', isClient);

export const browserLog = isClient
  ? {
      error: (...args: unknown[]) => console.error(args),
      warn: (...args: unknown[]) => console.warn(args),
      info: (...args: unknown[]) => console.info(args),
      debug: (...args: unknown[]) => console.debug(args),
    }
  : {
      error: NOOP,
      warn: NOOP,
      info: NOOP,
      debug: NOOP,
    };
