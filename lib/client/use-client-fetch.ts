'use client';

import { useEffect, useState } from 'react';
import { AppName } from '@/lib/app-name';
import { ClientCache, cacheEventTargetData, cacheEventTargetError } from '@/lib/client/client-cache';

export const useClientKapteinApiFetch = <T>(pathname: string, options?: RequestInit): Response<T> =>
  useClientProxyFetch<T>(AppName.KAPTEIN_API, pathname, options);

const useClientProxyFetch = <T>(api: AppName, pathname: string, options?: RequestInit): Response<T> =>
  useClientFetch<T>(`/api/proxy/${api}${pathname}`, options);

const useClientFetch = <T>(pathname: string, options?: RequestInit): Response<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    const cache = CACHES.get(pathname) ?? new ClientCache<T>(pathname, options);

    if (!CACHES.has(pathname)) {
      CACHES.set(pathname, cache);
    }

    const dataListener = (event: Event) => setData((event as CustomEvent).detail);
    const errorListener = (event: Event) => setError((event as CustomEvent).detail);

    cacheEventTargetData.addEventListener(pathname, dataListener);
    cacheEventTargetError.addEventListener(pathname, errorListener);

    cache.getData();

    return () => {
      cacheEventTargetData.removeEventListener(pathname, dataListener);
      cacheEventTargetError.removeEventListener(pathname, errorListener);
    };
  }, [pathname, options]);

  if (error !== null) {
    return { error, data: null, isLoading: false };
  }

  if (data !== null) {
    return { error: null, data, isLoading: false };
  }

  return { error: null, data: null, isLoading: true };
};

type Response<T> =
  | { error: string; data: null; isLoading: false }
  | { error: null; data: T; isLoading: false }
  | { error: null; data: null; isLoading: true };

// biome-ignore lint/suspicious/noExplicitAny: Needed for generic map
const CACHES = new Map<string, ClientCache<any>>();

export const resetCaches = () => {
  CACHES.forEach((cache) => {
    cache.refresh();
  });
};
