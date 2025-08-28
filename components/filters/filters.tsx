'use client';

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

  return <Ytelser ytelser={ytelser} onChange={(value) => createQueryString('ytelser', value.join(','))} />;
};

export const Filters = ({ ytelser }: { ytelser: IYtelse[] }) => {
  return (
    <Suspense>
      <FiltersInternal ytelser={ytelser} />
    </Suspense>
  );
};
