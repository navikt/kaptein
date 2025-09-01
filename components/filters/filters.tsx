'use client';

import { BoxNew } from '@navikt/ds-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Ytelser } from '@/components/filters/ytelser';
import type { IYtelse } from '@/lib/server/types';

export const Filters = ({ ytelser }: { ytelser: IYtelse[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <BoxNew padding="5">
      <Ytelser ytelser={ytelser} onChange={(value) => onChange('ytelser', value.join(','))} />
    </BoxNew>
  );
};
