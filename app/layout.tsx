import '@/app/globals.css';
import { Faro } from '@/components/faro';
import { Header } from '@/components/header/header';
import { Themed } from '@/components/themed';
import { getUser } from '@/lib/server/api';
import '@navikt/ds-css/darkside';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

interface Props {
  children: React.ReactNode;
}

const RootLayout = async ({ children }: Readonly<Props>) => {
  const user = await getUser();

  return (
    <html
      lang="nb"
      data-environment={process.env.NAIS_CLUSTER_NAME}
      data-version={process.env.VERSION}
      className="h-full"
    >
      <Faro />

      <head />

      <body className="flex h-full">
        <Themed className="flex grow flex-col overflow-hidden">
          <Header user={user} />
          <NuqsAdapter>{children}</NuqsAdapter>
        </Themed>
      </body>
    </html>
  );
};

export default RootLayout;
