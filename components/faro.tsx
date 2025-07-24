'use client';
import { useEffect } from 'react';
import { isDeployed } from '@/lib/environment';
import { grafana } from '@/lib/observability';

export const Faro = () => {
  useEffect(() => {
    grafana.initialize();

    if (!isDeployed) {
      return;
    }

    setTimeout(() => {
      // Calling getCurrentConsent() too early will return undefined.
      grafana.unpause();
    }, 100);
  }, []);

  return null;
};
