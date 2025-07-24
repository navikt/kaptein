import { getClientEnv } from '@/lib/client';
import { isClient } from '@/lib/environment';

export const VERSION: string | undefined = isClient ? getClientEnv('data-version') : process.env.VERSION;
