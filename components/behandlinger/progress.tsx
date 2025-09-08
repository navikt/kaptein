'use client';

import { ProgressBar, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useId, useState } from 'react';
import type { StreamProgressEvent } from '@/app/api/behandlinger-stream/progress/route';
import { ServerSentEventManager } from '@/lib/client/server-sent-events';

enum EventType {
  PROGRESS = 'progress',
}

export const Progress = () => {
  const [progress, setProgress] = useState('0.00');
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState<number | null>(null);

  const handleProgress = useCallback((data: StreamProgressEvent) => {
    setProgress(data.progress.toFixed(2));
    setCount(data.count);
    setTotal(data.total);
  }, []);

  useEffect(() => {
    const eventSource = new ServerSentEventManager<EventType>('/api/behandlinger-stream/progress');

    eventSource.addJsonEventListener<StreamProgressEvent>(EventType.PROGRESS, handleProgress);

    return () => {
      eventSource.close();
    };
  }, [handleProgress]);

  const labelId = useId();

  if (total === null) {
    <VStack>
      <p id={labelId}>Laster {count} behandlinger...</p>
      <ProgressBar size="large" aria-labelledby={labelId}>
        {progress}%
      </ProgressBar>
    </VStack>;
  }

  return (
    <VStack>
      <p id={labelId}>Laster {count} behandlinger...</p>
      <ProgressBar value={count} valueMax={total ?? undefined} size="large" aria-labelledby={labelId}>
        {progress}%
      </ProgressBar>
    </VStack>
  );
};
