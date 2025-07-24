import { Heading, VStack } from '@navikt/ds-react';
import Image from 'next/image';
import logo from './logo.png';

export default async function KapteinPage() {
  return (
    <VStack align="center" justify="center" padding="8" gap="8">
      <Heading level="1" size="xlarge" className="mb-4">
        Velkommen til Kaptein
      </Heading>
      <Image src={logo} alt="Kaptein-logo" />
    </VStack>
  );
}
