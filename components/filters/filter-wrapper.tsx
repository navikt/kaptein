import { BoxNew, VStack } from '@navikt/ds-react';

export const FilterWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full shrink-0 md:w-[450px] md:overflow-y-auto md:border-ax-border-neutral-subtle md:border-r-2">
    <VStack asChild gap="4">
      <BoxNew padding="6">{children}</BoxNew>
    </VStack>
  </div>
);
