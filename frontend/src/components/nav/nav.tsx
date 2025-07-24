import { InternalHeader } from '@navikt/ds-react';
import { styled } from 'styled-components';

export const Nav = () => (
  <InternalHeader.Title as={StyledNav} aria-label="Meny" data-testid="oppgaver-nav">
    <StyledNavLinkList />
  </InternalHeader.Title>
);

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
