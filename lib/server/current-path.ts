import { headers } from 'next/headers';
import { CURRENT_PATH_HEADER } from '@/lib/server/custom-headers';

export const getCurrentPath = async (): Promise<string> => {
  const headerList = await headers();

  return headerList.get(CURRENT_PATH_HEADER) ?? '/';
};
