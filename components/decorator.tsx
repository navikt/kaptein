import '@/app/globals.css';
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
    <html
      lang="nb"
      data-environment={process.env.NAIS_CLUSTER_NAME}
      data-version={process.env.VERSION}
      className="h-full"
    >
      <Faro />

      <head />

      <body className="h-full flex">
        <Themed className="grow flex flex-col">
          <Header user={user} />
          {children}
        </Themed>
      </body>
    </html>
  );
};
