'use client';

import { InternalHeader } from '@navikt/ds-react/InternalHeader';
import { format, startOfMonth } from 'date-fns';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { TildelingFilter } from '@/app/query-types';
import { ISO_DATE_FORMAT } from '@/lib/date';
import { QueryParam } from '@/lib/types/query-param';

const ACTIVE_CLASS = '!bg-ax-bg-accent-strong-pressed !text-ax-text-accent-contrast';
const TODAY = new Date();
const DEFAULT_TO = format(TODAY, ISO_DATE_FORMAT);
const DEFAULT_FROM = format(startOfMonth(TODAY), ISO_DATE_FORMAT);

export const Nav = () => {
  const params = useSearchParams();

  const setDefaultParams = useCallback((searchParams: URLSearchParams) => {
    searchParams.get(QueryParam.TILDELING) ?? searchParams.set(QueryParam.TILDELING, TildelingFilter.ALL);
    searchParams.get(QueryParam.ALDER_MAX_DAYS) ?? searchParams.set(QueryParam.ALDER_MAX_DAYS, '84');
    searchParams.get(QueryParam.ALDER_PER_YTELSE_MAX_DAYS) ??
      searchParams.set(QueryParam.ALDER_PER_YTELSE_MAX_DAYS, '84');
  }, []);

  const aktiveParams = useMemo(() => {
    const searchParams = new URLSearchParams(params.toString());

    searchParams.delete(QueryParam.FROM);
    searchParams.delete(QueryParam.TO);
    searchParams.delete(QueryParam.REGISTRERINGSHJEMLER);

    setDefaultParams(searchParams);

    return searchParams.toString();
  }, [params, setDefaultParams]);

  const ferdigstilteParams = useMemo(() => {
    const searchParams = new URLSearchParams(params.toString());

    searchParams.delete(QueryParam.TILDELING);
    searchParams.delete(QueryParam.KLAGEENHETER);
    searchParams.delete(QueryParam.INNSENDINGSHJEMLER);

    searchParams.get(QueryParam.FROM) ?? searchParams.set(QueryParam.FROM, DEFAULT_FROM);
    searchParams.get(QueryParam.TO) ?? searchParams.set(QueryParam.TO, DEFAULT_TO);

    setDefaultParams(searchParams);

    return searchParams.toString();
  }, [params, setDefaultParams]);

  return (
    <>
      <NavLink path="/aktive" params={aktiveParams}>Aktive saker</NavLink>
      <NavLink path="/ferdigstilte" params={ferdigstilteParams}>Ferdigstilte saker</NavLink>
      <NavLink path="/anker-i-tr" params={ferdigstilteParams}>Anker i TR</NavLink>
    </>
  );
};

interface Props {
  path: string;
  params: string;
  children: React.ReactNode;
}

const NavLink = ({ path, params, children }: Props) => {
  const pathname = usePathname();

  return (
    <InternalHeader.Button
      as={Link}
      className={pathname === path ? ACTIVE_CLASS : ''}
      href={`${path}?${params}`}
    >
      {children}
    </InternalHeader.Button>
  );
};