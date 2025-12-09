'use client';

import { InternalHeader } from '@navikt/ds-react/InternalHeader';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { RouteName } from '@/components/header/route-name';

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
  const params = useSearchParams().toString();

  return (
    <InternalHeader.Button
      as={Link}
      className={pathname === path ? ACTIVE_CLASS : ''}
      href={`${path}${params ? `?${params}` : ''}`}
    >
      {children}
    </InternalHeader.Button>
  );
};
