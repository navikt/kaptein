'use client';

import { InternalHeader } from '@navikt/ds-react/InternalHeader';
import { endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { TildelingFilter } from '@/app/query-types';
import { ISO_DATE_FORMAT, NOW, TODAY } from '@/lib/date';
import { QueryParam } from '@/lib/types/query-param';

const ACTIVE_CLASS = '!bg-ax-bg-accent-strong-pressed !text-ax-text-accent-contrast';
const DEFAULT_TO = TODAY;
const DEFAULT_FROM = format(startOfMonth(NOW), ISO_DATE_FORMAT);

const SAKSSTRØM_DEFAULT_FROM = format(startOfMonth(subMonths(NOW, 4)), ISO_DATE_FORMAT);
const SAKSSTRØM_DEFAULT_TO = format(endOfMonth(subMonths(NOW, 1)), ISO_DATE_FORMAT);

export const Nav = () => {
  const params = useSearchParams();

  const setDefaultParams = useCallback((searchParams: URLSearchParams) => {
    searchParams.get(QueryParam.TILDELING) ?? searchParams.set(QueryParam.TILDELING, TildelingFilter.ALL);
  }, []);

  const aktiveParams = useMemo(() => {
    const searchParams = new URLSearchParams(params.toString());

    searchParams.delete(QueryParam.FROM);
    searchParams.delete(QueryParam.TO);
    searchParams.delete(QueryParam.REGISTRERINGSHJEMLER);

    searchParams.get(QueryParam.ALDER_MAX_DAYS) ?? searchParams.set(QueryParam.ALDER_MAX_DAYS, '84');
    searchParams.get(QueryParam.ALDER_PER_YTELSE_MAX_DAYS) ??
      searchParams.set(QueryParam.ALDER_PER_YTELSE_MAX_DAYS, '84');

    setDefaultParams(searchParams);

    return searchParams.toString();
  }, [params, setDefaultParams]);

  const ferdigstilteParams = useMemo(() => {
    const searchParams = new URLSearchParams(params.toString());

    searchParams.delete(QueryParam.TILDELING);
    searchParams.delete(QueryParam.INNSENDINGSHJEMLER);

    searchParams.get(QueryParam.FROM) ?? searchParams.set(QueryParam.FROM, DEFAULT_FROM);
    searchParams.get(QueryParam.TO) ?? searchParams.set(QueryParam.TO, DEFAULT_TO);
    searchParams.get(QueryParam.ALDER_MAX_DAYS) ?? searchParams.set(QueryParam.ALDER_MAX_DAYS, '84');
    searchParams.get(QueryParam.ALDER_PER_YTELSE_MAX_DAYS) ??
      searchParams.set(QueryParam.ALDER_PER_YTELSE_MAX_DAYS, '84');

    setDefaultParams(searchParams);

    return searchParams.toString();
  }, [params, setDefaultParams]);

  const saksstrømParams = useMemo(() => {
    const searchParams = new URLSearchParams(params.toString());

    searchParams.get(QueryParam.FROM) ?? searchParams.set(QueryParam.FROM, SAKSSTRØM_DEFAULT_FROM);
    searchParams.get(QueryParam.TO) ?? searchParams.set(QueryParam.TO, SAKSSTRØM_DEFAULT_TO);

    searchParams.delete(QueryParam.ALDER_MAX_DAYS);
    searchParams.delete(QueryParam.ALDER_PER_YTELSE_MAX_DAYS);

    setDefaultParams(searchParams);

    return searchParams.toString();
  }, [params, setDefaultParams]);

  return (
    <>
      <NavLink path="/aktive" params={aktiveParams}>
        Aktive saker
      </NavLink>

      <NavLink path="/ferdigstilte" params={ferdigstilteParams}>
        Ferdigstilte saker
      </NavLink>

      <NavLink path="/saksstroem" params={saksstrømParams}>
        Saksstrøm
      </NavLink>

      {/* Same as ferdigstilteParams for now */}
      <NavLink path="/behandlingstid" params={ferdigstilteParams}>
        Behandlingstid
      </NavLink>

      <NavLink path="/aktive-anker-i-tr" params={aktiveParams}>
        Aktive anker i TR
      </NavLink>

      <NavLink path="/ferdigstilte-anker-i-tr" params={ferdigstilteParams}>
        Ferdigstilte anker i TR
      </NavLink>
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
    <InternalHeader.Button as={Link} className={pathname === path ? ACTIVE_CLASS : ''} href={`${path}?${params}`}>
      {children}
    </InternalHeader.Button>
  );
};
