'use client';

import { useFromFilter, useToFilter } from '@/lib/query-state/query-state';

export const useDateFilter = () => {
  const [fromFilter] = useFromFilter();
  const [toFilter] = useToFilter();

  return { fromFilter, toFilter };
};
