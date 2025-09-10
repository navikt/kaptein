'use client';

import { Button } from '@navikt/ds-react';
import { format, startOfMonth } from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ISO_DATE_FORMAT } from '@/lib/date';
import { ALL_QUERY_PARAMS, QueryParam } from '@/lib/types/query-param';

const TODAY = new Date();
const DEFAULT_TO = format(TODAY, ISO_DATE_FORMAT);
const DEFAULT_FROM = format(startOfMonth(TODAY), ISO_DATE_FORMAT);

export const Reset = () => {
  const params = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const handleReset = () => {
    const searchParams = new URLSearchParams(params.toString());

    for (const key of ALL_QUERY_PARAMS) {
      searchParams.delete(key);
    }

    searchParams.set(QueryParam.FROM, DEFAULT_FROM);
    searchParams.set(QueryParam.TO, DEFAULT_TO);

    router.push(`${pathName}?${searchParams.toString()}`);
  };

  return (
    <Button variant="secondary" onClick={handleReset}>
      Nullstill filtre
    </Button>
  );
};
