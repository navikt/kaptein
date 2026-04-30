import { join } from 'node:path';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { headers } from 'next/headers';
import { AppName } from '@/lib/app-name';
import { isLocal } from '@/lib/environment';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getLogger } from '@/lib/logger';
import { getOboToken } from '@/lib/server/get-obo-token';
import { recordSpanError } from '@/lib/tracing';
import {
  type IKodeverkSimpleValue,
  type IKodeverkValue,
  type IUserData,
  type IYtelse,
  KA_SAKSTYPER,
  type RegistreringshjemlerMap,
  type SakITRUtfall,
  type Sakstype,
  type SakstypeToPåVentReasons,
  type SakstypeToUtfall,
  TR_SAKSTYPER,
  type Utfall,
} from '@/lib/types';

const logger = getLogger('api');

const tracer = trace.getTracer('kaptein');

const KAPTEIN_PROXY_TARGET = new URL('https://kaptein.intern.nav.no/api/proxy');

const KABAL_INNSTILLINGER = new URL(
  isLocal ? `${KAPTEIN_PROXY_TARGET}/${AppName.KABAL_INNSTILLINGER}` : `http://${AppName.KABAL_INNSTILLINGER}`,
);

const KLAGE_KODEVERK = new URL(
  isLocal ? `${KAPTEIN_PROXY_TARGET}/${AppName.KLAGE_KODEVERK}` : `http://${AppName.KLAGE_KODEVERK}`,
);

const KAPTEIN_API = new URL(
  isLocal ? `${KAPTEIN_PROXY_TARGET}/${AppName.KAPTEIN_API}` : `http://${AppName.KAPTEIN_API}`,
);

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
  [AppName.KABAL_INNSTILLINGER]: (urlOptions) => copyUrlWithPath(KABAL_INNSTILLINGER, urlOptions),
  [AppName.KLAGE_KODEVERK]: (urlOptions) => copyUrlWithPath(KLAGE_KODEVERK, urlOptions),
  [AppName.KAPTEIN_API]: (urlOptions) => copyUrlWithPath(KAPTEIN_API, urlOptions),
};

const getHeaders = async (appName: AppName): Promise<Headers> => {
  const incomingHeaders = await headers();

  if (isLocal) {
    return new Headers(incomingHeaders);
  }

  return new Headers({
    accept: 'application/json',
    authorization: `Bearer ${await getOboToken(appName, incomingHeaders)}`,
  });
};

const getResponse = async (appName: AppName, path: string): Promise<Response> => {
  const url = SERVICE_URLS[appName]({ path });

  return tracer.startActiveSpan(`getResponse ${appName} ${path}`, async (span) => {
    try {
      const res = await fetch(url, { method: 'GET', headers: await getHeaders(appName) });

      span.setAttribute('http.status_code', res.status);
      span.setAttribute('http.url', url.toString());

      if (res.status === 401) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: 'Unauthorized' });
        throw new UnauthorizedError();
      }

      if (!res.ok) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: `Failed to fetch - ${res.status}` });
        throw new InternalServerError(res.status, 'Kunne ikke hente data');
      }

      span.setStatus({ code: SpanStatusCode.OK });

      return res;
    } catch (error) {
      recordSpanError(span, error);

      if (error instanceof UnauthorizedError) {
        logger.warn('Unauthorized', { url: url.toString(), status: 401 });
      } else if (error instanceof InternalServerError) {
        logger.error(`Failed to fetch ${url.toString()} - ${error.status}`, {
          url: url.toString(),
          status: error.status,
        });
      } else if (error instanceof Error) {
        logger.error('Failed to fetch', {
          url: url.toString(),
          error: error.message,
          stack: error.stack,
        });
      } else {
        logger.error('Failed to fetch', { url: url.toString(), error: 'Unknown error' });
      }

      throw error;
    } finally {
      span.end();
    }
  });
};

const getData = async <T>(appName: AppName, path: string): Promise<T> => {
  const res = await getResponse(appName, path);

  const data: T = await res.json();

  return data;
};

export const getUser = () => getData<IUserData>(AppName.KABAL_INNSTILLINGER, '/me/brukerdata');

export const getYtelser = () => getData<IYtelse[]>(AppName.KLAGE_KODEVERK, '/kodeverk/ytelser');

export const getUtfall = () =>
  getData<IKodeverkSimpleValue<Utfall | SakITRUtfall>[]>(AppName.KLAGE_KODEVERK, '/kodeverk/utfall');

export const getKlageenheter = async () => {
  const enheter = await getData<IKodeverkSimpleValue[]>(AppName.KLAGE_KODEVERK, '/kodeverk/klageenheter');

  return [...enheter.filter((e) => e.id !== '2103'), STYRINGSENHETEN];
};

export const getLovkildeToRegistreringshjemler = () =>
  getData<IKodeverkValue[]>(AppName.KLAGE_KODEVERK, '/kodeverk/lovkildetoregistreringshjemler');

export const getUtfallForSakstype = async (sakstype: Sakstype) =>
  getData<IKodeverkSimpleValue<Utfall>[]>(AppName.KLAGE_KODEVERK, `/kodeverk/sakstypertoutfall/${sakstype}`);

const getSakstyperToUtfall = async () =>
  getData<SakstypeToUtfall[]>(AppName.KLAGE_KODEVERK, '/kodeverk/sakstypertoutfall');

export const getDefaultSakstyperToUtfall = async () => {
  const sakstyper = await getSakstyperToUtfall();

  return sakstyper.filter(({ id }) => KA_SAKSTYPER.includes(id));
};

export const getTrSaksTyperToUtfall = async () => {
  const sakstyper = await getSakstyperToUtfall();

  return sakstyper.filter(({ id }) => TR_SAKSTYPER.includes(id));
};

export const getInnsendingshjemlerMap = () =>
  getData<Record<string, string>>(AppName.KLAGE_KODEVERK, '/kodeverk/hjemlermap');

export const getRegistreringshjemlerMap = () =>
  getData<RegistreringshjemlerMap>(AppName.KLAGE_KODEVERK, '/kodeverk/registreringshjemlermap');

export const getKASakstyper = async () => {
  const sakstyper = await getData<IKodeverkSimpleValue<Sakstype>[]>(AppName.KLAGE_KODEVERK, '/kodeverk/sakstyper');

  return sakstyper.filter(({ id }) => KA_SAKSTYPER.includes(id));
};

export const getTRSaksttyper = async () => {
  const sakstyper = await getData<IKodeverkSimpleValue<Sakstype>[]>(AppName.KLAGE_KODEVERK, '/kodeverk/sakstyper');

  return sakstyper.filter(({ id }) => TR_SAKSTYPER.includes(id));
};

export const getSakstyperToPåVentReasons = async () =>
  getData<SakstypeToPåVentReasons[]>(AppName.KLAGE_KODEVERK, '/kodeverk/sakstyper-to-satt-paa-vent-reasons');

const STYRINGSENHETEN: IKodeverkSimpleValue = { id: '4200', navn: 'Klageinstans styringsenhet' };
