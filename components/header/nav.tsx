'use client';

import { InternalHeader } from '@navikt/ds-react/InternalHeader';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { KEEP_PARAMS, RouteName } from '@/components/header/default-params';
import { isSakITRUtfall, Sakstype } from '@/lib/types';
import { ALL_QUERY_PARAMS, QueryParam } from '@/lib/types/query-param';

const ACTIVE_CLASS = 'bg-ax-bg-accent-strong-pressed! text-ax-text-accent-contrast!';

export const Nav = () => (
  <>
    <NavLink path={RouteName.AKTIVE}>Aktive saker</NavLink>
    <NavLink path={RouteName.FERDIGSTILTE}>Ferdigstilte saker</NavLink>
    <NavLink path={RouteName.SAKSSTRØM}>Saksstrøm</NavLink>
    <NavLink path={RouteName.BEHANDLINGSTID}>Behandlingstid</NavLink>
    <NavLink path={RouteName.AKTIVE_SAKER_I_TR}>Aktive saker i TR</NavLink>
    <NavLink path={RouteName.FERDIGSTILTE_I_TR}>Ferdigstilte saker i TR</NavLink>
  </>
);

interface Props {
  path: RouteName;
  children: React.ReactNode;
}

const NavLink = ({ path, children }: Props) => {
  const pathname = usePathname();
  const params = useSearchParams();

  return (
    <InternalHeader.Button
      as={Link}
      className={pathname === path ? ACTIVE_CLASS : ''}
      href={`${path}${removeUnusedParams(path, params)}`}
    >
      {children}
    </InternalHeader.Button>
  );
};

const removeUnusedParams = (route: RouteName, params: URLSearchParams) => {
  const newParams = new URLSearchParams(params.toString());

  const unusedParams = ALL_QUERY_PARAMS.filter((p) => !KEEP_PARAMS[route].includes(p));

  for (const param of unusedParams) {
    newParams.delete(param);
  }

  if (route === RouteName.AKTIVE_SAKER_I_TR || route === RouteName.FERDIGSTILTE_I_TR) {
    filterSakerITRParams(newParams, false);
  } else {
    filterSakerITRParams(newParams, true);
  }

  const paramString = newParams.toString();

  return paramString === '' ? '' : `?${paramString}`;
};

const filterSakerITRParams = (searchParams: URLSearchParams, remove: boolean) => {
  const sakstyper = searchParams.get(QueryParam.SAKSTYPER)?.split(',') || [];
  const utfall = searchParams.get(QueryParam.UTFALL)?.split(',') || [];

  const filteredSakstyper = remove
    ? sakstyper.filter(
        (s) => s !== Sakstype.ANKE_I_TRYGDERETTEN && s !== Sakstype.BEGJÆRING_OM_GJENOPPTAK_I_TRYGDERETTEN,
      )
    : sakstyper.filter(
        (s) => s === Sakstype.ANKE_I_TRYGDERETTEN || s === Sakstype.BEGJÆRING_OM_GJENOPPTAK_I_TRYGDERETTEN,
      );

  if (filteredSakstyper.length === 0) {
    searchParams.delete(QueryParam.SAKSTYPER);
  } else {
    searchParams.set(QueryParam.SAKSTYPER, filteredSakstyper.join(','));
  }

  const filteredUtfall = remove ? utfall.filter((u) => !isSakITRUtfall(u)) : utfall.filter((u) => isSakITRUtfall(u));

  if (filteredUtfall.length === 0) {
    searchParams.delete(QueryParam.UTFALL);
  } else {
    searchParams.set(QueryParam.UTFALL, filteredUtfall.join(','));
  }
};
