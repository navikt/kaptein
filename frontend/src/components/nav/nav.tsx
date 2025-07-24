import { Role } from '@app/types/bruker';
import { BulletListIcon } from '@navikt/aksel-icons';
import { InternalHeader } from '@navikt/ds-react';
import { NavLink, type NavLinkProps } from 'react-router-dom';
import { styled } from 'styled-components';

export const Nav = () => (
  <InternalHeader.Title as={StyledNav} aria-label="Meny" data-testid="oppgaver-nav">
    <StyledNavLinkList>
      <NavItem to="/oppgaver" testId="oppgaver-nav-link" roles={[Role.KABAL_SAKSBEHANDLING, Role.KABAL_ROL]}>
        <BulletListIcon /> Oppgaver
      </NavItem>
    </StyledNavLinkList>
  </InternalHeader.Title>
);

interface NavItemProps extends NavLinkProps {
  testId?: string;
  roles?: Role[];
}

const NavItem = ({ testId, roles, ...props }: NavItemProps) => {
  return (
    <StyledNavListItem>
      <StyledNavLink {...props} data-testid={testId} />
    </StyledNavListItem>
  );
};

const StyledNav = styled.nav`
  height: 100%;
  flex-grow: 1;
  overflow-x: auto;
`;

const StyledNavLinkList = styled.ul`
  height: 100%;
  display: flex;
  list-style: none;
  padding: 0;
  align-items: center;
  margin: 0;
  gap: var(--a-spacing-4);
`;

const StyledNavListItem = styled.li`
  text-align: center;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  gap: var(--a-spacing-2);
  align-items: center;
  width: 100%;
  border-bottom: var(--a-spacing-1) solid transparent;
  word-break: keep-all;
  white-space: nowrap;
  border-left: none;
  text-decoration: none;
  color: var(--a-text-on-inverted);
  padding: 0;
  padding-left: var(--a-spacing-1);
  padding-right: var(--a-spacing-1);
  transition: border-bottom-color 0.2s ease-in-out;

  &.active {
    border-bottom: var(--a-spacing-1) solid var(--a-blue-300);
  }

  &:hover {
    border-bottom: var(--a-spacing-1) solid var(--a-text-subtle);
  }
`;
