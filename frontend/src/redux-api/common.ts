import { queryStringify } from '@app/functions/query-string';
import { setHeaders } from '@app/headers';
import { type FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

export const IS_LOCALHOST = window.location.hostname === 'localhost';

const mode: RequestMode | undefined = IS_LOCALHOST ? 'cors' : undefined;

export const staggeredBaseQuery = (baseUrl: string) => {
  const fetch = fetchBaseQuery({
    baseUrl,
    mode,
    credentials: 'include',
    paramsSerializer: queryStringify,
    prepareHeaders: setHeaders,
  });

  return retry(
    async (args: string | FetchArgs, api, extraOptions) => {
      const result = await fetch(args, api, extraOptions);

      if (typeof result.error === 'undefined') {
        return result;
      }

      const status = result.meta?.response?.status;

      if (status === undefined) {
        retry.fail(result.error);
      }

      if (status === 401) {
        if (!IS_LOCALHOST) {
          window.location.assign('/oauth2/login');
        }

        retry.fail(result.error);
      }

      if (status >= 400 && status < 500) {
        retry.fail(result.error);
      }

      return result;
    },
    {
      maxRetries: 10,
      backoff: (attempt) => new Promise((resolve) => setTimeout(resolve, 1000 * attempt)),
    },
  );
};

export const PROXY_BASE_QUERY = staggeredBaseQuery('');

const API_PATH = '/api';
export const API_BASE_QUERY = staggeredBaseQuery(API_PATH);

export const KABAL_API_BASE_PATH = '/api/kabal-api';
export const INNSTILLINGER_BASE_PATH = '/api/kabal-innstillinger';

export const INNSTILLINGER_BASE_QUERY = staggeredBaseQuery(INNSTILLINGER_BASE_PATH);
export const KABAL_API_BASE_QUERY = staggeredBaseQuery(KABAL_API_BASE_PATH);
