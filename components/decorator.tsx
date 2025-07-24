import '@/app/globals.css';
import { Page } from '@navikt/ds-react/Page';
import { Faro } from '@/components/faro';
import { Header } from '@/components/header/header';
import { Themed } from '@/components/themed';
import { getUser } from '@/lib/server/api';

interface Props {
  children: React.ReactNode;
}

export const Decorator = async ({ children }: Readonly<Props>) => {
  const user = await getUser();

  return (
    <html lang="nb" data-environment={process.env.NAIS_CLUSTER_NAME} data-version={process.env.VERSION}>
      <Faro />

      <head />

      <body>
        <Header user={user} />
        <Page contentBlockPadding="end">
          <Themed>{children}</Themed>
        </Page>
      </body>
    </html>
  );
};
