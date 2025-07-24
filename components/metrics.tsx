'use client';

import { useSendMetricEvent } from '@/lib/amplitude/hook';
import type { AmplitudeContextData, EventData } from '@/lib/amplitude/types';

interface MetricEventProps {
  eventName?: string;
  /* The domain of the event. Used by Grafana. */
  domain: string;
  context: AmplitudeContextData;
  eventData?: EventData;
}

export const MetricEvent = ({ eventName = 'besøk', domain, eventData, context }: MetricEventProps) => {
  useSendMetricEvent(eventName, domain, { ...context, ...eventData });

  return null;
};
