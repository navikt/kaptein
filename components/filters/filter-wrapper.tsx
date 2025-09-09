import { BoxNew, VStack } from '@navikt/ds-react';

export const FilterWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-[450px] shrink-0 overflow-y-auto border-ax-border-neutral-subtle border-r-2">
    <VStack asChild gap="4">
      <BoxNew padding="6">{children}</BoxNew>
    </VStack>
  </div>
);
