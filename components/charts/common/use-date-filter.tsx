'use client';

import { useQueryState } from 'nuqs';
import { parseAsDateString } from '@/app/custom-query-parsers';
import { QueryParam } from '@/lib/types/query-param';

export const useDateFilter = () => {
  const [fromFilter] = useQueryState(QueryParam.FROM, parseAsDateString);
  const [toFilter] = useQueryState(QueryParam.TO, parseAsDateString);

  return {
    fromFilter: fromFilter === null ? null : fromFilter,
    toFilter: toFilter === null ? null : toFilter,
  };
};
