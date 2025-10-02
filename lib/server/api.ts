import { headers } from 'next/headers';
import { join } from 'path';
import { AppName } from '@/lib/app-name';
import { isLocal } from '@/lib/environment';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getLogger } from '@/lib/logger';
import { getOboToken } from '@/lib/server/get-obo-token';
import { generateTraceParent } from '@/lib/server/traceparent';
import {
  type IKodeverkSimpleValue,
  type IKodeverkValue,
  type IUserData,
  type IYtelse,
  type PåVentReason,
  Sakstype,
  type SakstypeToUtfall,
} from '@/lib/types';

const logger = getLogger('api');

const KAPTEIN_DEV_DOMAIN = 'https://kaptein.intern.dev.nav.no';
const KAPTEIN_PROXY_URL = new URL(`${KAPTEIN_DEV_DOMAIN}/api/proxy`);

const KABAL_API = new URL(isLocal ? `${KAPTEIN_PROXY_URL}/${AppName.KABAL_API}` : `http://${AppName.KABAL_API}`);

const KABAL_INNSTILLINGER = new URL(
  isLocal ? `${KAPTEIN_PROXY_URL}/${AppName.KABAL_INNSTILLINGER}` : `http://${AppName.KABAL_INNSTILLINGER}`,
);

const KLAGE_KODEVERK = new URL(
  isLocal ? `${KAPTEIN_PROXY_URL}/${AppName.KLAGE_KODEVERK}` : `http://${AppName.KLAGE_KODEVERK}`,
);

const KAPTEIN_API = new URL(isLocal ? `${KAPTEIN_PROXY_URL}/${AppName.KAPTEIN_API}` : `http://${AppName.KAPTEIN_API}`);

interface UrlOptions {
  path?: string;
  searchParams?: URLSearchParams;
}

const copyUrlWithPath = (url: URL, { path, searchParams }: UrlOptions) => {
  const newUrl = new URL(url);

  if (path === undefined && searchParams === undefined) {
    return newUrl;
  }

  if (path !== undefined) {
    newUrl.pathname = join(newUrl.pathname, path);
  }

  if (searchParams !== undefined) {
    newUrl.search = searchParams.toString();
  }

  return newUrl;
};

// Always returns a new URL instance to avoid mutating the original.
export const SERVICE_URLS: Record<AppName, (urlOptions: UrlOptions) => URL> = {
  [AppName.KABAL_API]: (urlOptions) => copyUrlWithPath(KABAL_API, urlOptions),
  [AppName.KABAL_INNSTILLINGER]: (urlOptions) => copyUrlWithPath(KABAL_INNSTILLINGER, urlOptions),
  [AppName.KLAGE_KODEVERK]: (urlOptions) => copyUrlWithPath(KLAGE_KODEVERK, urlOptions),
  [AppName.KAPTEIN_API]: (urlOptions) => copyUrlWithPath(KAPTEIN_API, urlOptions),
};

const getHeaders = async (appName: AppName, traceparent: string): Promise<Headers> => {
  const incomingHeaders = await headers();

  if (isLocal) {
    const copiedHeaders = new Headers(incomingHeaders);
    copiedHeaders.set('traceparent', traceparent);
    return copiedHeaders;
  }

  return new Headers({
    accept: 'application/json',
    traceparent,
    authorization: `Bearer ${await getOboToken(appName, incomingHeaders)}`,
  });
};

const getResponse = async (appName: AppName, path: string): Promise<Response> => {
  const { traceparent, traceId, spanId } = generateTraceParent();
  const url = SERVICE_URLS[appName]({ path });

  try {
    const res = await fetch(url, { method: 'GET', headers: await getHeaders(appName, traceparent) });

    if (res.status === 401) {
      throw new UnauthorizedError();
    }

    if (!res.ok) {
      throw new InternalServerError(res.status, 'Kunne ikke hente data');
    }

    return res;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      logger.warn('Unauthorized', traceId, spanId, { url: url.toString(), status: 401 });
    } else if (error instanceof InternalServerError) {
      logger.error(`Failed to fetch ${url.toString()} - ${error.status}`, traceId, spanId, {
        url: url.toString(),
        status: error.status,
      });
    } else if (error instanceof Error) {
      logger.error('Failed to fetch', traceId, spanId, {
        url: url.toString(),
        error: error.message,
        stack: error.stack,
      });
    } else {
      logger.error('Failed to fetch', traceId, spanId, { url: url.toString(), error: 'Unknown error' });
    }

    throw error;
  }
};

export const getData = async <T>(appName: AppName, path: string): Promise<T> => {
  const res = await getResponse(appName, path);

  const data: T = await res.json();

  return data;
};

export const getUser = () => getData<IUserData>(AppName.KABAL_INNSTILLINGER, '/me/brukerdata');

export const getKodeverk = (path: string) => getData(AppName.KLAGE_KODEVERK, `/kodeverk/${path}`);

export const getYtelser = () => getData<IYtelse[]>(AppName.KLAGE_KODEVERK, '/kodeverk/ytelser');

export const getUtfall = () => getData<IKodeverkSimpleValue[]>(AppName.KLAGE_KODEVERK, '/kodeverk/utfall');

export const getKlageenheter = async () => {
  const enheter = await getData<IKodeverkSimpleValue[]>(AppName.KLAGE_KODEVERK, '/kodeverk/klageenheter');

  return [...enheter, STYRINGSENHETEN];
};

export const getLovkildeToRegistreringshjemler = () =>
  getData<IKodeverkValue[]>(AppName.KLAGE_KODEVERK, '/kodeverk/lovkildetoregistreringshjemler');

export const getSakstyperToUtfall = async () => {
  const sakstyper = await getData<SakstypeToUtfall[]>(AppName.KLAGE_KODEVERK, '/kodeverk/sakstypertoutfall');

  return sakstyper.filter(({ id }) => RELEVANT_SAKSTYPER.includes(id));
};

export const getInnsendingshjemlerMap = () =>
  getData<Record<string, string>>(AppName.KLAGE_KODEVERK, '/kodeverk/hjemlermap');

export const getPåVentReasons = () =>
  getData<IKodeverkValue<PåVentReason>[]>(AppName.KLAGE_KODEVERK, '/kodeverk/satt-paa-vent-reasons');

export const getSakstyper = async () => {
  const sakstyper = await getData<IKodeverkSimpleValue<Sakstype>[]>(AppName.KLAGE_KODEVERK, '/kodeverk/sakstyper');

  return sakstyper.filter(({ id }) => RELEVANT_SAKSTYPER.includes(id));
};

const STYRINGSENHETEN: IKodeverkSimpleValue = { id: '4200', navn: 'Nav klageinstans styringsenhet' };

const RELEVANT_SAKSTYPER = [
  Sakstype.KLAGE,
  Sakstype.ANKE,
  Sakstype.BEHANDLING_ETTER_TR_OPPHEVET,
  Sakstype.OMGJØRINGSKRAV,
];
