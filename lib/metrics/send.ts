'use client';

import { browserLog } from '@/lib/browser-log';
import type { AmplitudeContextData } from '@/lib/metrics/types';
import { grafana } from '@/lib/observability';

export const sendMetricEvent = async (
  eventName: string,
  domain: string,
  context: AmplitudeContextData & Record<string, string>,
) => {
  try {
    grafana.pushEvent(eventName, domain, context);
  } catch (error) {
    browserLog.error('Failed to send metric event to Grafana', error);
  }
};
