import { BoxNew, VStack } from '@navikt/ds-react';

export const FilterWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full shrink-0 md:w-[450px] md:overflow-y-auto md:border-2 md:border-ax-border-neutral-subtle">
    <VStack asChild gap="4">
      <BoxNew padding="6">{children}</BoxNew>
    </VStack>
  </div>
);
