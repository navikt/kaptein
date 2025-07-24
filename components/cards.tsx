import { BoxNew } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
}

export const Card = ({ children }: Props) => {
  return <BaseCard>{children}</BaseCard>;
};

export const DoubleHeightCard = ({ children }: Props) => {
  return <BaseCard span={2}>{children}</BaseCard>;
};

const BaseCard = ({ children, span = 1 }: Props & { span?: number }) => {
  return (
    <BoxNew
      padding="4"
      shadow="dialog"
      background="neutral-soft"
      borderRadius="medium"
      style={{ gridRowEnd: `span ${span}` }}
    >
      {children}
    </BoxNew>
  );
};
