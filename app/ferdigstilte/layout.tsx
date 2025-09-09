import { Filters } from '@/app/ferdigstilte/filters';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex grow overflow-hidden">
      <Filters />
      {children}
    </div>
  );
}
