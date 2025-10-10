import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { resetCaches } from '@/lib/client/use-client-fetch';

export const ResetCacheButton = () => (
  <Button variant="secondary" onClick={resetCaches} icon={<ArrowCirclepathIcon aria-hidden />}>
    Oppdater data
  </Button>
);
