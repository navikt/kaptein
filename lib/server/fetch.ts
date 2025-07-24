import { AppName, getOboToken } from '@/lib/server/get-obo-token';
export const getFromKabal = async (
  url: string,
  incomingHeaders: Headers,
  traceparent?: string,
): ReturnType<typeof fetch> => {
  const token = await getOboToken(AppName.KABAL_API, incomingHeaders);

  const headers: HeadersInit = { authorization: `Bearer ${token}` };

  if (traceparent !== undefined) {
    headers.traceparent = traceparent;
  }

  return await fetch(url, { method: 'GET', headers });
};
