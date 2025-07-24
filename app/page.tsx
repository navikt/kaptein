'use client';

import { BoxNew, Heading, VStack } from '@navikt/ds-react';
import Image from 'next/image';
import logo from './logo.png';

export default function KapteinPage() {
  return (
    <BoxNew padding="4" width="100%" height="100vh">
      <VStack align="center" justify="center" padding="8" gap="8" height="100%">
        <Heading level="1" size="xlarge" className="mb-4">
          Velkommen til Kaptein
        </Heading>
        <Image src={logo} alt="Kaptein-logo" width={200} height={200} />
      </VStack>
    </BoxNew>
  );
}
