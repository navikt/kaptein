export const ChartsWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex grow md:overflow-auto">
    <div className="grid w-full auto-rows-[750px] grid-cols-1 gap-6 p-6 xl:grid-cols-2 2xl:grid-cols-3">{children}</div>
  </div>
);
