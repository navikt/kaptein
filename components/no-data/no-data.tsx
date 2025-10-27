import { BarChartIcon } from '@navikt/aksel-icons';
import { Alert, Heading, VStack } from '@navikt/ds-react';

interface Props {
  title: string;
}

export const NoData = ({ title }: Props) => (
  <VStack className="relative h-full pt-6" align="center" justify="center">
    <BarChartIcon fontSize={450} aria-hidden className="absolute z-0" color="var(--ax-bg-neutral-moderate)" />
    <Heading size="small" className="z-1">
      {title}
    </Heading>
    <VStack align="center" justify="center" className="z-1 grow">
      <Alert variant="info">Ingen data</Alert>
    </VStack>
  </VStack>
);
