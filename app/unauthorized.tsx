import { Box, Button, LocalAlert } from '@navikt/ds-react';
import { MetricEvent } from '@/components/metrics';
import { getCurrentPath } from '@/lib/server/current-path';

export default async function Unauthorized() {
  const path = await getCurrentPath();

  return (
    <Box padding="space-32">
      <MetricEvent eventName="unauthorized" domain="unauthorized" context={{ path, page: 'unauthorized' }} />

      <LocalAlert status="error">
        <LocalAlert.Header>
          <LocalAlert.Title>Du ser ut til å være logget ut</LocalAlert.Title>
        </LocalAlert.Header>
        <LocalAlert.Content>
          <Button variant="primary" as="a" href="/oauth2/login">
            Logg inn
          </Button>
        </LocalAlert.Content>
      </LocalAlert>
    </Box>
  );
}
