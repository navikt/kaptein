import { Filters } from '@/app/aktive-saker-i-tr/filters';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex grow flex-col overflow-auto lg:flex-row lg:overflow-hidden">
      <Filters />
      {children}
    </div>
  );
}
