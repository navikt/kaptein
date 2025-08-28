import { Filters } from '@/components/filters/filters';
import { getBehandlinger, getYtelser } from '@/lib/server/api';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const ytelser = await getYtelser();
  const behandlinger = await getBehandlinger();

  console.log(behandlinger);

  return (
    <div className="grow flex">
      <div className="w-96 border-r-2">
        <Filters ytelser={ytelser} />
      </div>
      {children}
    </div>
  );
}
