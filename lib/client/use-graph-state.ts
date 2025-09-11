'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ServerSentEventManager } from '@/lib/client/server-sent-events';
import { type EntryData, GRAPH_DATA_EVENT_NAME, type Graph } from '@/lib/graphs';

interface CacheData<S> extends EntryData<S> {
  id: string;
}

export const useGraphState = <S>(
  graph: Graph,
  initialState: S,
  overrideParams?: Record<string, string | number | boolean | undefined | null>,
) => {
  const urlParams = useSearchParams();
  const params = new URLSearchParams(urlParams);

  if (overrideParams !== undefined) {
    for (const [key, value] of Object.entries(overrideParams)) {
      switch (typeof value) {
        case 'string':
          params.set(key, value);
          break;
        case 'number':
          params.set(key, value.toString(10));
          break;
        case 'boolean':
          params.set(key, value ? 'true' : 'false');
          break;
        case 'undefined':
          params.delete(key);
          break;
        case 'object':
          if (value === null) {
            params.delete(key);
          }
          break;
      }
    }
  }

  const cache = useRef<Map<string, CacheData<S>>>(new Map());

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [{ id, state, count }, setData] = useState<CacheData<S>>({ id: '', state: initialState, count: 0 });

  // console.debug(`Graph data (${id}):`, state);

  useEffect(() => {
    const cacheKey = `${graph}?${params.toString()}`;
    const cached = cache.current.get(cacheKey);

    if (cached !== undefined) {
      // console.debug(`Graph cache restored (${cached.id}):`, cached.state);
      setData(cached);
    } else {
      setIsLoading(true);
    }

    const eventSource = new ServerSentEventManager(`/api/graphs/${graph}`, params);

    eventSource.addJsonEventListener<EntryData<S>>(GRAPH_DATA_EVENT_NAME, ({ state, count }, { lastEventId }) => {
      const data: CacheData<S> = { id: lastEventId, state, count };
      setData((e) => (e.id === lastEventId ? e : data));
      setIsInitialized(true);
      setIsLoading(false);
      // console.debug(`Graph cache updated (${lastEventId}):`, state);
      cache.current.set(cacheKey, data);
    });

    return () => eventSource.close();
  }, [graph, params]);

  return { isLoading, isInitialized, state, hash: id, count };
};
