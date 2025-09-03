import { Alert, BoxNew, Button } from '@navikt/ds-react';
import { MetricEvent } from '@/components/metrics';
import { getCurrentPath } from '@/lib/server/current-path';

export default async function Unauthorized() {
  const path = await getCurrentPath();

  return (
    <BoxNew padding="8">
      <MetricEvent eventName="unauthorized" domain="unauthorized" context={{ path, page: 'unauthorized' }} />

      <Alert variant="error">
        <div className="flex items-center gap-4">
          Du ser ut til å være logget ut
          <Button variant="primary" as="a" href="/oauth2/login">
            Logg inn
          </Button>
        </div>
      </Alert>
    </BoxNew>
  );
}
