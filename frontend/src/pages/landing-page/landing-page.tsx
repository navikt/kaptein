import { PageWrapper } from '@app/pages/page-wrapper';
import { Heading, VStack } from '@navikt/ds-react';
import logo from './logo.png';

export const LandingPage = () => {
  return (
    <PageWrapper>
      <VStack align="center" height="100%" gap="4">
        <Heading level="1" size="large" spacing>
          Velkommen til Kaptein
        </Heading>

        <img src={logo} alt="Kaptein-logo" />
      </VStack>
    </PageWrapper>
  );
};
