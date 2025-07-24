import { headers } from 'next/headers';
import { isLocal } from '@/lib/environment';
import { InternalServerError, UnauthorizedError } from '@/lib/errors';
import { getLogger } from '@/lib/logger';
import { generateTraceParent, getFromKabal } from '@/lib/server/fetch';
import { AppName } from '@/lib/server/get-obo-token';
import type {
  BehandlingResponse,
  IKodeverkSimpleValue,
  IKodeverkValue,
  IUserData,
  IYtelse,
  Sakstype,
} from '@/lib/server/types';

const logger = getLogger('api');

const DEV_DOMAIN = 'https://kaptein.intern.dev.nav.no';

const KABAL_API = isLocal ? `${DEV_DOMAIN}/api` : 'http://kabal-api/api/kaptein';
const KABAL_INNSTILLINGER = isLocal ? `${DEV_DOMAIN}/api` : 'http://kabal-innstillinger';
const KLAGE_KODEVERK = isLocal ? `${DEV_DOMAIN}/api/kodeverk` : 'http://klage-kodeverk-api/kodeverk';

const getUrl = (appName: AppName) => {
  switch (appName) {
    case AppName.KABAL_API:
      return KABAL_API;
    case AppName.KABAL_INNSTILLINGER:
      return KABAL_INNSTILLINGER;
    case AppName.KLAGE_KODEVERK:
      return KLAGE_KODEVERK;
  }
};

export const getData = async <T>(appName: AppName, path: string): Promise<T> => {
  const { traceparent, traceId, spanId } = generateTraceParent();
  const h = await headers();
  const url = getUrl(appName) + path;

  try {
    const start = Date.now();
    const res = await (isLocal ? fetch(url, { headers: h }) : getFromKabal(appName, url, h, traceparent));
    const duration = Date.now() - start;
    logger.debug(`Fetched ${url} - ${res.status} (${duration}ms)`, traceId, spanId, { url });

    if (res.status === 401) {
      logger.warn('Unauthorized', traceId, spanId, { url });
      throw new UnauthorizedError();
    }

    if (!res.ok) {
      logger.error(`Failed to fetch ${url} - ${res.status}`, traceId, spanId, { url });
      throw new InternalServerError(res.status, 'Kunne ikke hente data');
    }

    const data: T = await res.json();

    return data;
  } catch (error) {
    logger.error('Failed to fetch', traceId, spanId, {
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? (error.stack ?? '') : '',
    });

    throw error;
  }
};

export const getUser = () => getData<IUserData>(AppName.KABAL_INNSTILLINGER, '/me/brukerdata');

export const getBehandlinger = () => getData<BehandlingResponse>(AppName.KABAL_API, '/behandlinger');

export const getKodeverk = (path: string) => getData(AppName.KLAGE_KODEVERK, `/${path}`);
export const getYtelser = () => getData<IYtelse[]>(AppName.KLAGE_KODEVERK, '/ytelser');
export const getKlageenheter = () => getData<IKodeverkSimpleValue[]>(AppName.KLAGE_KODEVERK, '/klageenheter');
export const getSakstyper = () => getData<IKodeverkSimpleValue<Sakstype>[]>(AppName.KLAGE_KODEVERK, '/sakstyper');

const ANKE_I_TRYGDERETTEN_ID = '3';

export const getSakstyperWithoutAnkeITR = async () => {
  const data = await getSakstyper();

  return data.filter((s) => s.id !== ANKE_I_TRYGDERETTEN_ID);
};
export const getPåVentReasons = () => getData<IKodeverkValue[]>(AppName.KLAGE_KODEVERK, '/satt-paa-vent-reasons');
