import { useEffect } from 'react';
import type { AmplitudeContextData } from '@/lib/amplitude/types';
import { sendMetricEvent } from '@/lib/metrics';

export const useSendMetricEvent = (
  eventName: string,
  domain: string,
  context: AmplitudeContextData & Record<string, string>,
) => {
  useEffect(() => {
    setTimeout(() => {
      sendMetricEvent(eventName, domain, { ...context, referrer: document.referrer });
    }, 100);
  }, [eventName, context, domain]);
};
