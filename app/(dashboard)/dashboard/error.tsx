"use client";

import { RotateCcw } from "lucide-react";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-[768px] mx-auto px-4 py-16 text-center">
      <p className="text-[15px] font-semibold text-ink mb-1.5">
        The dashboard didn&apos;t load
      </p>
      <p className="text-[13.5px] text-ash mb-6">
        Nothing was changed. Try again, or come back in a moment.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 bg-rose text-paper text-[13px] font-medium px-4 h-9 rounded-[10px] hover:bg-crimson transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
        Try again
      </button>
    </div>
  );
}
