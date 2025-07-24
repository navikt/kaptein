import { Filters } from '@/components/filters/filters';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex grow">
      <div className="w-96 border-r-2">
        <Filters />
      </div>
      <div className="flex grow">{children}</div>
    </div>
  );
}
