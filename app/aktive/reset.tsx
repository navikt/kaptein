'use client';

import { Button } from '@navikt/ds-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ALL_QUERY_PARAMS } from '@/lib/types/query-param';

export const Reset = () => {
  const params = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const handleReset = () => {
    const searchParams = new URLSearchParams(params.toString());

    for (const key of ALL_QUERY_PARAMS) {
      searchParams.delete(key);
    }

    router.push(`${pathName}?${searchParams.toString()}`);
  };

  return (
    <Button variant="secondary" onClick={handleReset}>
      Nullstill filtre
    </Button>
  );
};
