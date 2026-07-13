interface TapeProgressProps {
  completed: number;
  total: number;
}

export function TapeProgress({ completed, total }: TapeProgressProps) {
  const pct = (completed / total) * 100;
  const steps = Array.from({ length: total + 1 }, (_, i) => i);

  return (
    <div className="w-full">
      <div className="relative h-9">
        <div className="absolute left-0 right-0 top-4 h-[3px] bg-seam rounded-full" />
        <div
          className="absolute left-0 top-4 h-[3px] bg-rose rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />

        {steps.map((i) => {
          const left = (i / total) * 100;
          const done = i <= completed;
          return (
            <div
              key={i}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${left}%`, transform: "translateX(-50%)" }}
            >
              <span
                className={`w-[1.5px] h-3 ${done ? "bg-rose" : "bg-linen"}`}
              />
              <span
                className="mt-1 text-[10px] tabular-nums"
                style={{
                  fontFamily: "var(--font-label)",
                  color: done ? "var(--color-crimson)" : "var(--color-ash)",
                }}
              >
                {i}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
