'use client';

import { useEffect, useState } from 'react';
import { AppName } from '@/lib/app-name';

export const useClientKapteinApiFetch = <T>(pathname: string, options?: RequestInit): Response<T> =>
  useClientProxyFetch<T>(AppName.KAPTEIN_API, pathname, options);

export const useClientProxyFetch = <T>(api: AppName, pathname: string, options?: RequestInit): Response<T> =>
  useClientFetch<T>(`/api/proxy/${api}${pathname}`, options);

export const useClientFetch = <T>(pathname: string, options?: RequestInit): Response<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    fetch(pathname, options)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`${response.status}: ${await response.text()}`);
        }

        return response.json();
      })
      .then(setData)
      .catch((error) => {
        setError(error instanceof Error ? error.message : 'Ukjent feil');
      });
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
