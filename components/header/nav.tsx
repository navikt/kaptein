'use client';

import { InternalHeader } from '@navikt/ds-react/InternalHeader';
import { format, startOfMonth } from 'date-fns';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { ISO_DATE_FORMAT } from '@/lib/date';
import { QueryParam } from '@/lib/types/query-param';

const ACTIVE_CLASS = '!bg-ax-bg-neutral-moderate-pressed';
const TODAY = new Date();
const DEFAULT_TO = format(TODAY, ISO_DATE_FORMAT);
const DEFAULT_FROM = format(startOfMonth(TODAY), ISO_DATE_FORMAT);

export const Nav = () => {
  const pathname = usePathname();
  const params = useSearchParams();

  const defaultParams = useMemo(() => {
    const searchParams = new URLSearchParams(params.toString());

    searchParams.get(QueryParam.FROM) ?? searchParams.set(QueryParam.FROM, DEFAULT_FROM);
    searchParams.get(QueryParam.TO) ?? searchParams.set(QueryParam.TO, DEFAULT_TO);

    return searchParams.toString();
  }, [params]);

  const ferdigstilteParams = useMemo(() => {
    const searchParams = new URLSearchParams(defaultParams);
    searchParams.delete(QueryParam.TILDELING);
    searchParams.delete(QueryParam.KLAGEENHETER);

    return searchParams.toString();
  }, [defaultParams]);

  return (
    <>
      <InternalHeader.Button
        as={Link}
        className={pathname === '/aktive' ? ACTIVE_CLASS : ''}
        href={`/aktive?${defaultParams}`}
      >
        Aktive saker
      </InternalHeader.Button>

      <InternalHeader.Button
        as={Link}
        className={pathname === '/ferdigstilte' ? ACTIVE_CLASS : ''}
        href={`/ferdigstilte?${ferdigstilteParams}`}
      >
        Ferdigstilte saker
      </InternalHeader.Button>
    </>
  );
};
