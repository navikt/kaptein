import { Box } from '@navikt/ds-react';

interface Props {
  children: React.ReactNode;
  span?: number;
  colSpan?: number;
  fullWidth?: boolean;
}

export const Card = ({ children, span = 2, fullWidth = false }: Props) => {
  return (
    <Box
      padding="space-16"
      shadow="dialog"
      background="neutral-soft"
      borderRadius="4"
      position="relative"
      style={{
        gridRowEnd: `span ${span}`,
        ...(fullWidth ? { gridColumn: '1 / -1' } : {}),
      }}
    >
      {children}
    </Box>
  );
};
