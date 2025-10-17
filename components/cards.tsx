import { BoxNew, HelpText } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
  span?: number;
  colSpan?: number;
  fullWidth?: boolean;
  helpContent?: React.ReactNode;
}

export const Card = ({ children, span = 2, fullWidth = false, helpContent }: Props) => {
  return (
    <BoxNew
      padding="4"
      shadow="dialog"
      background="neutral-soft"
      borderRadius="medium"
      position="relative"
      style={{
        gridRowEnd: `span ${span}`,
        ...(fullWidth ? { gridColumn: '1 / -1' } : {}),
      }}
    >
      {helpContent === undefined ? null : (
        <HelpText title="Hjelpetekst" className="absolute top-4 right-4 z-1">
          {helpContent}
        </HelpText>
      )}
      {children}
    </BoxNew>
  );
};
