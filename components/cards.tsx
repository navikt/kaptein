import { BoxNew } from '@navikt/ds-react';

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 768;
const DOUBLE_HEIGHT = DEFAULT_HEIGHT * 2;

interface Props {
  children: React.ReactNode;
}

export const Card = ({ children }: Props) => {
  return (
    <BaseCard width={DEFAULT_WIDTH} height={DEFAULT_HEIGHT}>
      {children}
    </BaseCard>
  );
};

export const DoubleHeightCard = ({ children }: Props) => {
  return (
    <BaseCard width={DEFAULT_WIDTH} height={DOUBLE_HEIGHT}>
      {children}
    </BaseCard>
  );
};

const BaseCard = ({ children, width, height }: Props & { width: number; height: number }) => {
  return (
    <BoxNew
      padding="4"
      shadow="dialog"
      width={`${width}px`}
      height={`${height}px`}
      background="neutral-soft"
      borderRadius="medium"
    >
      {children}
    </BoxNew>
  );
};
