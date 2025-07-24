import '@/app/globals.css';
import { Faro } from '@/components/faro';
import { Header } from '@/components/header/header';
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

      <body className="h-full flex flex-col">
        <Header user={user} />
        <div className="grow flex">{children}</div>
      </body>
    </html>
  );
};
