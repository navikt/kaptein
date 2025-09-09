import { AppName, getOboToken } from '@/lib/server/get-obo-token';

export const getFromKabal = async (
  appName: AppName,
  url: string,
  incomingHeaders: Headers,
  traceparent: string,
): ReturnType<typeof fetch> => {
  const headers: HeadersInit =
    appName === AppName.KLAGE_KODEVERK
      ? {}
      : { authorization: `Bearer ${await getOboToken(appName, incomingHeaders)}` };

  if (traceparent !== undefined) {
    headers.traceparent = traceparent;
  }

  return await fetch(url, { method: 'GET', headers });
};
