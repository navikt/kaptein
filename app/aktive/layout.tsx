import { AktiveFilters } from '@/components/filters/aktive-filters';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex grow overflow-hidden">
      <div className="w-[450px] shrink-0 overflow-y-auto border-ax-border-neutral-subtle border-r-2">
        <AktiveFilters />
      </div>
      <div className="flex grow overflow-auto">{children}</div>
    </div>
  );
}
