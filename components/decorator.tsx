import '@/app/globals.css';
import { Page } from '@navikt/ds-react/Page';
import { Faro } from '@/components/faro';

interface Props {
  children: React.ReactNode;
}

export const Decorator = async ({ children }: Readonly<Props>) => {
  return (
    <html lang="nb" data-environment={process.env.NAIS_CLUSTER_NAME} data-version={process.env.VERSION}>
      <Faro />

      <head />

      <body>
        <Page contentBlockPadding="end">
            {children}
        </Page>
      </body>
    </html>
  );
};
