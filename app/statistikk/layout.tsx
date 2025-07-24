import { Filters } from '@/components/filters/filters';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grow flex">
      <div className="w-96 border-r-2">
        <Filters />
      </div>
      {children}
    </div>
  );
}
