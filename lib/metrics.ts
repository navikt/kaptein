'use client';

import type { AmplitudeContextData } from '@/lib/amplitude/types';
import { grafana } from '@/lib/observability';

export const sendMetricEvent = async (
  eventName: string,
  domain: string,
  context: AmplitudeContextData & Record<string, string>,
) => {
  try {
    grafana.pushEvent(eventName, domain, context);
  } catch (error) {
    console.error('Failed to send metric event to Grafana', error);
  }
};
