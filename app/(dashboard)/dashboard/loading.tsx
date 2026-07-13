export default function DashboardLoading() {
  return (
    <div className="max-w-[768px] mx-auto px-4 py-10 animate-pulse">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-6 w-48 bg-seam rounded-[6px]" />
          <div className="h-3 w-32 bg-seam rounded-[4px] mt-3" />
        </div>
        <div className="h-9 w-28 bg-seam rounded-[10px]" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[104px] bg-seam rounded-[10px]" />
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <div className="h-40 bg-seam rounded-[10px]" />
        <div className="h-56 bg-seam rounded-[10px]" />
      </div>
    </div>
  );
}
