'use client';

import { LeaveIcon } from '@navikt/aksel-icons';
import { ActionMenu, Spacer } from '@navikt/ds-react';
import { InternalHeader } from '@navikt/ds-react/InternalHeader';
import Link from 'next/link';
import { AppThemeSwitcher } from '@/components/header/app-theme';
import { Nav } from '@/components/header/nav';
import { browserLog } from '@/lib/browser-log';
import type { IUserData } from '@/lib/types';

export const Header = ({ user }: { user: IUserData }) => {
  browserLog.debug('User data:', user);

  return (
    <InternalHeader>
      <InternalHeader.Title href="/" as={Link}>
        Kaptein
      </InternalHeader.Title>

      <Nav />

      <Spacer />

      <ActionMenu>
        <ActionMenu.Trigger>
          <InternalHeader.UserButton
            data-testid="user-menu-button"
            name={user?.navn ?? 'Ukjent bruker'}
            description={`Enhet: ${user?.ansattEnhet?.navn ?? 'Ingen enhet'}`}
            className="whitespace-nowrap"
          />
        </ActionMenu.Trigger>

        <UserDropdown />
      </ActionMenu>
    </InternalHeader>
  );
};

const UserDropdown = () => (
  <ActionMenu.Content className="w-auto max-w-75 overflow-visible">
    <ActionMenu.Group label="Tema">
      <ActionMenu.Item as={AppThemeSwitcher} />
    </ActionMenu.Group>

    <ActionMenu.Divider />

    <ActionMenu.Group label="Bruker">
      <ActionMenu.Item
        as="a"
        href="/oauth2/logout"
        data-testid="logout-link"
        className="cursor-pointer text-ax-text-danger-decoration"
        variant="danger"
        icon={<LeaveIcon />}
      >
        Logg ut
      </ActionMenu.Item>
    </ActionMenu.Group>
  </ActionMenu.Content>
);
