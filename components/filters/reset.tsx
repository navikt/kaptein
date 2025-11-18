'use client';

import { ArrowUndoIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { usePathname, useRouter } from 'next/navigation';

export const Reset = () => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <Button variant="secondary" onClick={() => router.push(pathName)} icon={<ArrowUndoIcon aria-hidden />}>
      Nullstill filtre
    </Button>
  );
};
