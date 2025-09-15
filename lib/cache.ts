'use client';

import { useEffect, useState } from 'react';
import { browserLog } from '@/lib/browser-log';
import type { Behandling, IYtelse } from '@/lib/server/types';

export class RequestCache<T> {
  private cache: T | null = null;
  isLoading = false;

  constructor(
    private appName: AppName,
    private path: string,
  ) {}

  private fetch = async (appName: AppName, path: string) => {
    console.time('fetch' + path);
    this.isLoading = true;

    let data: T;

    try {
      const url = getUrl(appName) + path;

      const res = await fetch(url);

      if (appName === AppName.KABAL_API) {
        const reader = res.body?.getReader();

        if (reader !== undefined) {
          const textDecoder = new TextDecoder();
          let string = '';

          while (true) {
            const { done, value } = await reader.read();

            if (value) {
              string += textDecoder.decode(value);
            }

            if (done) {
              break;
            }
          }

          if (string.endsWith('\n')) {
            string = string.slice(0, -1);
          }

          const jsonString = '[' + string.replaceAll('\n', ',\n') + ']';

          try {
            data = JSON.parse(jsonString);
            browserLog.debug('Fetched data', data);
          } catch (e) {
            console.error('Failed to parse JSON', e, jsonString);
            throw e;
          }
        } else {
          throw new Error('Response body is null');
        }
      } else {
        data = await res.json();
      }

      this.cache = data;
      window.dispatchEvent(new CustomEvent('request-cache-update', { detail: data }));
      console.timeEnd('fetch' + path);

      return data;
    } finally {
      this.isLoading = false;
    }
  };

  public get = async (): Promise<T> => {
    if (this.cache) {
      return this.cache;
    }

    if (!this.isLoading) {
      return this.fetch(this.appName, this.path);
    }

    return new Promise<T>((resolve) => {
      window.addEventListener('request-cache-update', function handler(event) {
        window.removeEventListener('request-cache-update', handler);

        resolve((event as CustomEvent).detail);
      });
    });
  };
}

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

const KABAL_API = '/api';
const KABAL_INNSTILLINGER = '/api';
const KLAGE_KODEVERK = '/api/kodeverk';

export enum AppName {
  KABAL_API = 'kabal-api',
  KABAL_INNSTILLINGER = 'kabal-innstillinger',
  KLAGE_KODEVERK = 'klage-kodeverk',
}

const ytelserCache = new RequestCache<IYtelse[]>(AppName.KLAGE_KODEVERK, '/ytelser');
const behandlingerCache = new RequestCache<Behandling[]>(AppName.KABAL_API, '/behandlinger-stream');
export const getCachedYtelser = () => ytelserCache.get();
export const getCachedBehandlinger = () => behandlingerCache.get();

export const useBehandlinger = () => {
  const [behandlinger, setBehandlinger] = useState<Behandling[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getCachedBehandlinger()
      .then((data) => {
        setBehandlinger(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return { behandlinger, loading };
};

export const useYtelser = () => {
  const [ytelser, setYtelser] = useState<IYtelse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getCachedYtelser()
      .then((data) => {
        setYtelser(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return { ytelser, loading };
};
