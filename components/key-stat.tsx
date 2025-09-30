import { BoxNew, VStack } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
  description?: string;
}

export const KeyStat = ({ children, description }: Props) => {
  return (
    <BoxNew asChild padding="4" shadow="dialog" background="neutral-soft" borderRadius="medium">
      <VStack as="section" gap="2" align="center" justify="start" marginBlock={description ? '0 2' : '0'}>
        <span className="text-5xl">{children}</span>

        <h1 className="font-normal">{description}</h1>
      </VStack>
    </BoxNew>
  );
};
