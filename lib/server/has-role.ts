'use server';

import 'server-only';
import type { UserRoles } from '@/lib/roles';
import { getUserRoles } from '@/lib/server/get-user-roles';

export const hasRoles = async (...requiredRoles: UserRoles[]): Promise<boolean> => {
  const userRoles = await getUserRoles();

  if (userRoles === null || userRoles.length === 0) {
    return false;
  }

  for (const role of requiredRoles) {
    if (userRoles.includes(role)) {
      return true;
    }
  }

  return false;
};
