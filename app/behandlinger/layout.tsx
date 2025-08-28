import { Filters } from '@/components/filters/filters';
import { getYtelser } from '@/lib/server/api';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const ytelser = await getYtelser();
  // const behandlinger = await getBehandlinger();

  const behandlinger = await fetch('/api/behandlinger');
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
