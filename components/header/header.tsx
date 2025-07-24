'use client';

import { LeaveIcon } from '@navikt/aksel-icons';
import { ActionMenu, Spacer } from '@navikt/ds-react';
import { InternalHeader } from '@navikt/ds-react/InternalHeader';
import { AppThemeSwitcher } from '@/components/header/app-theme';
import { Themed } from '@/components/themed';
import type { IUserData } from '@/lib/server/types';

export const Header = ({ user }: { user: IUserData }) => (
  <Themed>
    <InternalHeader>
      <InternalHeader.Title as="h1">Kaptein</InternalHeader.Title>
      <Spacer />
      <ActionMenu>
        <ActionMenu.Trigger>
          <InternalHeader.UserButton
            data-testid="user-menu-button"
            name={user.navn}
            description={`Enhet: ${user.ansattEnhet.navn}`}
            className="whitespace-nowrap"
          />
        </ActionMenu.Trigger>

        <UserDropdown />
      </ActionMenu>
    </InternalHeader>
  </Themed>
);

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

    <ActionMenu.Divider />
  </ActionMenu.Content>
);
