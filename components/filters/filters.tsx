'use client';

import { BoxNew } from '@navikt/ds-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Ytelser } from '@/components/filters/ytelser';
import type { IYtelse } from '@/lib/server/types';

export const FiltersInternal = ({ ytelser }: { ytelser: IYtelse[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);

    router.push(`?${params.toString()}`);
  };

  return (
    <BoxNew padding="5">
      <Ytelser ytelser={ytelser} onChange={(value) => createQueryString('ytelser', value.join(','))} />
    </BoxNew>
  );
};

export const Filters = ({ ytelser }: { ytelser: IYtelse[] }) => {
  return (
    <Suspense>
      <FiltersInternal ytelser={ytelser} />
    </Suspense>
  );
};
