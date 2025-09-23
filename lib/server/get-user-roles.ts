'use server';

import 'server-only';
import { validateAzureToken } from '@navikt/oasis';
import { headers } from 'next/headers';
import { getRoles, type UserRoles } from '@/lib/roles';

export const getUserRoles = async (): Promise<UserRoles[] | null> => {
  const token = (await headers()).get('authorization');

  if (token === null) {
    return null;
  }

  const valid = await validateAzureToken(token);

  if (!valid.ok) {
    return null;
  }

  const { groups } = valid.payload;

  return getRoles(groups);
};
