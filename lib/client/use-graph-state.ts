'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ServerSentEventManager } from '@/lib/client/server-sent-events';
import { GRAPH_DATA_EVENT_NAME } from '@/lib/graphs';

interface Data<S> {
  id: string;
  state: S;
}

export const useGraphState = <S>(graph: string, initialState: S) => {
  const params = useSearchParams();
  const cache = useRef<Map<string, Data<S>>>(new Map());

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [{ id, state }, setData] = useState<Data<S>>({ id: '', state: initialState });

  console.debug(`Graph data (${id}):`, state);

  useEffect(() => {
    const cacheKey = `${graph}?${params.toString()}`;
    const cached = cache.current.get(cacheKey);

    if (cached !== undefined) {
      console.debug(`Graph cache restored (${cached.id}):`, cached.state);
      setData(cached);
    } else {
      setIsLoading(true);
    }

    const eventSource = new ServerSentEventManager(`/api/graphs/${graph}`, params);

    eventSource.addJsonEventListener<S>(GRAPH_DATA_EVENT_NAME, (s, { lastEventId }) => {
      const data: Data<S> = { id: lastEventId, state: s };
      setData((e) => (e.id === lastEventId ? e : data));
      setIsInitialized(true);
      setIsLoading(false);
      console.debug(`Graph cache updated (${lastEventId}):`, s);
      cache.current.set(cacheKey, data);
    });

    return () => eventSource.close();
  }, [graph, params]);

  return { isLoading, isInitialized, state, hash: id };
};
