'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ServerSentEventManager } from '@/lib/client/server-sent-events';

export const useGraphData = <S>(path: string, initialState: S, eventName = 'graph') => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState<S>(initialState);

  const params = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    const eventSource = new ServerSentEventManager(path, params);

    eventSource.addJsonEventListener<S>(eventName, (s) => {
      setData(s);
      setIsInitialized(true);
      setIsLoading(false);
    });

    return () => eventSource.close();
  }, [path, params, eventName]);

  return { isLoading, isInitialized, data };
};
