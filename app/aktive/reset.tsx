'use client';

import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { usePathname, useRouter } from 'next/navigation';
import { TildelingFilter } from '@/app/query-types';
import { QueryParam } from '@/lib/types/query-param';

export const Reset = () => {
  const router = useRouter();
  const pathName = usePathname();

  const handleReset = () => {
    const searchParams = new URLSearchParams();

    searchParams.set(QueryParam.TILDELING, TildelingFilter.ALL);
    searchParams.set(QueryParam.ALDER_MAX_DAYS, '84');

    router.push(`${pathName}?${searchParams.toString()}`);
  };

  return (
    <Button variant="secondary" onClick={handleReset} icon={<ArrowUndoIcon aria-hidden />}>
      Nullstill filtre
    </Button>
  );
};
