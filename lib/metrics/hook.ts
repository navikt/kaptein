import { useEffect } from 'react';
import { sendMetricEvent } from '@/lib/metrics/send';
import type { AmplitudeContextData } from '@/lib/metrics/types';

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
