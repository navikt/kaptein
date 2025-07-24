import { BoxNew } from '@navikt/ds-react';
import { Ytelser } from '@/components/filters/ytelser';
import type { IYtelse } from '@/lib/server/types';

export const Filters = ({ ytelser }: { ytelser: IYtelse[] }) => (
  <BoxNew padding="5">
    <Ytelser ytelser={ytelser} />
  </BoxNew>
);
