'use client';

export const getClientEnv = (attribute: string): string | undefined =>
  document.documentElement.getAttribute(attribute) ?? undefined;
