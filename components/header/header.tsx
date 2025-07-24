'use client';

import { LeaveIcon } from '@navikt/aksel-icons';
import { ActionMenu, Spacer } from '@navikt/ds-react';
import { InternalHeader } from '@navikt/ds-react/InternalHeader';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppThemeSwitcher } from '@/components/header/app-theme';
import type { IUserData } from '@/lib/server/types';

const ACTIVE_CLASS = '!bg-ax-bg-neutral-moderate-pressed';

export const Header = ({ user }: { user: IUserData }) => {
  const pathname = usePathname();
  return (
    <InternalHeader>
      <InternalHeader.Title href="/">Kaptein</InternalHeader.Title>

      <InternalHeader.Button as={Link} prefetch className={pathname === '/alle' ? ACTIVE_CLASS : ''} href="/alle">
        Alle saker
      </InternalHeader.Button>

      <InternalHeader.Button as={Link} prefetch className={pathname === '/aktive' ? ACTIVE_CLASS : ''} href="/aktive">
        Aktive saker
      </InternalHeader.Button>

      <InternalHeader.Button
        as={Link}
        prefetch
        className={pathname === '/ferdigstilte' ? ACTIVE_CLASS : ''}
        href="/ferdigstilte"
      >
        Ferdigstilte saker
      </InternalHeader.Button>

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

    <ActionMenu.Divider />
  </ActionMenu.Content>
);
