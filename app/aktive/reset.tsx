'use client';

import { Button } from '@navikt/ds-react';
import { usePathname, useRouter } from 'next/navigation';

export const Reset = () => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <Button variant="secondary" onClick={() => router.push(pathName)}>
      Nullstill filtre
    </Button>
  );
};
