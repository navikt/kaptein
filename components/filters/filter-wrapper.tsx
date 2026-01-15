import { Box, HStack } from '@navikt/ds-react';

export const FilterWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full shrink-0 lg:w-[450px] lg:overflow-y-auto lg:border-ax-border-neutral-subtle lg:border-r-2">
    <HStack asChild gap="space-16" width="fit-content">
      <Box padding="space-24">{children}</Box>
    </HStack>
  </div>
);
