import { BoxNew, Heading } from '@navikt/ds-react';

interface KeyStatProps {
  title: string;
  value: number | string;
  description: string;
}

export const KeyStat = ({ title, value, description }: KeyStatProps) => (
  <BoxNew padding="4" borderRadius="large" background="raised" height="100%">
    <Heading level="3" size="medium" spacing>
      {title}
    </Heading>
    <Heading level="2" size="xlarge" spacing>
      {value}
    </Heading>
    <BoxNew as="p" className="text-ax-small text-ax-text-neutral-subtle">
      {description}
    </BoxNew>
  </BoxNew>
);
