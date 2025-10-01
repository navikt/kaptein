'use client';

import { endOfDay, startOfDay } from 'date-fns';
import { useQueryState } from 'nuqs';
import { parseAsDate } from '@/app/custom-query-parsers';
import { QueryParam } from '@/lib/types/query-param';

export const useDateFilter = () => {
  const [fromFilter] = useQueryState(QueryParam.FROM, parseAsDate);
  const [toFilter] = useQueryState(QueryParam.TO, parseAsDate);

  return {
    fromFilter: fromFilter === null ? null : startOfDay(fromFilter),
    toFilter: toFilter === null ? null : endOfDay(toFilter),
  };
};
