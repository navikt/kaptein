import { BoxNew } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
  span?: number;
}

export const Card = ({ children, span = 2 }: Props) => {
  return (
    <BoxNew
      padding="4"
      shadow="dialog"
      background="neutral-soft"
      borderRadius="medium"
      position="relative"
      style={{ gridRowEnd: `span ${span}` }}
    >
      {children}
    </BoxNew>
  );
};
