import { Filters } from '@/app/ferdigstilte-anker-i-tr/filters';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex grow flex-col overflow-auto md:flex-row md:overflow-hidden">
      <Filters />
      {children}
    </div>
  );
}
