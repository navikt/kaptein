import { BodyShort, Box, Heading, VStack } from '@navikt/ds-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import logo from './logo_small.png';

export const metadata: Metadata = {
  title: 'Kaptein',
};

export default function KapteinPage() {
  return (
    <Box padding="space-16" width="100%" height="100vh">
      <VStack align="center" justify="center" padding="space-32" gap="space-32" height="100%">
        <Heading level="1" size="xlarge" className="mb-4">
          Velkommen til Kaptein
        </Heading>
        <Image src={logo} alt="Kaptein-logo" width={200} height={200} />
        <BodyShort className="border-ax-neutral-500 border-l-4 p-3 italic" size="large">
          Statistikk er den vitenskap som sier at hvis man har ett bein i fryseboksen og et annet på kokeplaten, så har
          man det i gjennomsnitt ganske skjønt.
        </BodyShort>
      </VStack>
    </Box>
  );
}
