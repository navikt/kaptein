import { FerdigstilteFilters } from '@/components/filters/ferdigstilte-filters';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex grow overflow-hidden">
      <div className="w-[450px] shrink-0 overflow-y-auto border-ax-border-neutral-subtle border-r-2">
        <FerdigstilteFilters />
      </div>
      <div className="flex grow overflow-auto">{children}</div>
    </div>
  );
}
