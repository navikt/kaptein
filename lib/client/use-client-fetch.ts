import { useEffect, useState } from 'react';

export const useClientFetch = <T>(url: string | URL | Request, options?: RequestInit): Response<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    fetch(url, options)
      .then(async (response) => {
        if (!response.ok) {
          setError(`${response.status}: ${await response.text()}`);
        }

        return response.json();
      })
      .then(setData)
      .catch((error) => {
        setError(error instanceof Error ? error.message : 'Ukjent feil');
      });
  }, [url, options]);

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
