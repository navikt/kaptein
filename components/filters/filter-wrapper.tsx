import { BoxNew, HStack } from '@navikt/ds-react';

export const FilterWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full shrink-0 lg:w-[450px] lg:overflow-y-auto lg:border-ax-border-neutral-subtle lg:border-r-2">
    <HStack asChild gap="4" width="fit-content">
      <BoxNew padding="6">{children}</BoxNew>
    </HStack>
  </div>
);
