'use client';

import { BoxNew, ProgressBar, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useId, useState } from 'react';
import type { StreamProgressEvent } from '@/app/api/behandlinger-stream/progress/route';
import { ServerSentEventManager } from '@/lib/client/server-sent-events';

enum EventType {
  PROGRESS = 'progress',
}

export const BehandlingerProgress = () => {
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState<number | null>(null);

  const handleProgress = useCallback((data: StreamProgressEvent) => {
    setProgress(data.progress);
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

  console.log('Progress', { count, total, progress });

  const labelId = useId();

  if (total === null) {
    return (
      <Wrapper>
        <p id={labelId}>Laster {count} behandlinger...</p>

        <ProgressBar size="large" aria-labelledby={labelId} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <p id={labelId}>
        Laster {count}/{total} behandlinger ({progress.toFixed(2)} %)...
      </p>

      <ProgressBar size="large" aria-labelledby={labelId} value={count} valueMax={total} />
    </Wrapper>
  );
};

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => (
  <VStack position="absolute" left="0" top="0" right="0" bottom="0" justify="center" align="center">
    <BoxNew padding="4" borderRadius="medium" shadow="dialog" background="overlay" minWidth="300px" maxWidth="90%">
      <VStack gap="2">{children}</VStack>
    </BoxNew>
  </VStack>
);
