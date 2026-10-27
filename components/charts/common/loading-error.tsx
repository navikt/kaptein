import { LocalAlert, VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';

interface Props {
  title: ReactNode;
  children?: ReactNode;
}

export const LoadingError = ({ title, children }: Props) => (
  <VStack justify="start" align="center" className="w-full p-6">
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
      </LocalAlert.Header>
      {children === undefined ? null : <LocalAlert.Content>{children}</LocalAlert.Content>}
    </LocalAlert>
  </VStack>
);
