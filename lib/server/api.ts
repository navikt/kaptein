import { headers } from 'next/headers';
import { isLocal } from '@/lib/environment';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getLogger } from '@/lib/logger';
import { getFromKabal } from '@/lib/server/fetch';
import { AppName } from '@/lib/server/get-obo-token';
import { generateTraceParent } from '@/lib/server/traceparent';
import {
  type IKodeverkSimpleValue,
  type IKodeverkValue,
  type IUserData,
  type IYtelse,
  Sakstype,
  type SakstypeToUtfall,
} from '@/lib/server/types';

const logger = getLogger('api');

const DEV_DOMAIN = 'https://kaptein.intern.dev.nav.no';

const KABAL_API = isLocal ? `${DEV_DOMAIN}/api` : 'http://kabal-api/api/kaptein';
const KABAL_INNSTILLINGER = isLocal ? `${DEV_DOMAIN}/api` : 'http://kabal-innstillinger';
const KLAGE_KODEVERK = isLocal ? `${DEV_DOMAIN}/api/kodeverk` : 'http://klage-kodeverk-api/kodeverk';

export const getUrl = (appName: AppName) => {
  switch (appName) {
    case AppName.KABAL_API:
      return KABAL_API;
    case AppName.KABAL_INNSTILLINGER:
      return KABAL_INNSTILLINGER;
    case AppName.KLAGE_KODEVERK:
      return KLAGE_KODEVERK;
  }
};

export const getResponse = async (appName: AppName, path: string): Promise<Response> => {
  const { traceparent, traceId, spanId } = generateTraceParent();
  const h = await headers();
  const url = getUrl(appName) + path;

  try {
    const res = await (isLocal ? fetch(url, { headers: h }) : getFromKabal(appName, url, h, traceparent));

    if (res.status === 401) {
      logger.warn('Unauthorized', traceId, spanId, { url });
      throw new UnauthorizedError();
    }

    if (!res.ok) {
      logger.error(`Failed to fetch ${url} - ${res.status}`, traceId, spanId, { url });
      throw new InternalServerError(res.status, 'Kunne ikke hente data');
    }

    return res;
  } catch (error) {
    logger.error('Failed to fetch', traceId, spanId, {
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? (error.stack ?? '') : '',
    });

    throw error;
  }
};

export const getData = async <T>(appName: AppName, path: string): Promise<T> => {
  const res = await getResponse(appName, path);

  const data: T = await res.json();

  return data;
};

export const getUser = () => getData<IUserData>(AppName.KABAL_INNSTILLINGER, '/me/brukerdata');

export const getKodeverk = (path: string) => getData(AppName.KLAGE_KODEVERK, `/${path}`);
export const getYtelser = () => getData<IYtelse[]>(AppName.KLAGE_KODEVERK, '/ytelser');
export const getUtfall = () => getData<IKodeverkSimpleValue[]>(AppName.KLAGE_KODEVERK, '/utfall');
export const getKlageenheter = async () => {
  const enheter = await getData<IKodeverkSimpleValue[]>(AppName.KLAGE_KODEVERK, '/klageenheter');

  return [...enheter, STYRINGSENHETEN];
};
export const getLovkildeToRegistreringshjemler = () =>
  getData<IKodeverkValue[]>(AppName.KLAGE_KODEVERK, '/lovkildetoregistreringshjemler');
export const getSakstyperToUtfall = async () => {
  const sakstyper = await getData<SakstypeToUtfall[]>(AppName.KLAGE_KODEVERK, '/sakstypertoutfall');

  return sakstyper.filter(({ id }) => id !== Sakstype.ANKE_I_TRYGDERETTEN);
};
export const getInnsendingshjemlerMap = () => getData<Record<string, string>>(AppName.KLAGE_KODEVERK, '/hjemlermap');
export const getPåVentReasons = () => getData<IKodeverkValue[]>(AppName.KLAGE_KODEVERK, '/satt-paa-vent-reasons');
export const getSakstyper = async () => {
  const sakstyper = await getData<IKodeverkSimpleValue<Sakstype>[]>(AppName.KLAGE_KODEVERK, '/sakstyper');

  return sakstyper.filter(({ id }) => id !== Sakstype.ANKE_I_TRYGDERETTEN);
};

const STYRINGSENHETEN: IKodeverkSimpleValue = { id: '4200', navn: 'Nav klageinstans styringsenhet' };
