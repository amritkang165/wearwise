import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      {/* Brand panel — linen background */}
      <div className="hidden flex-col justify-between bg-linen p-10 lg:flex lg:w-[400px]">
        <div className="flex items-center gap-2.5">
          <Sparkles className="size-5 text-rose" />
          <span className="text-[15px] font-bold text-ink">WearWise</span>
        </div>

        <div>
          <h2 className="text-[22px] font-bold leading-snug text-ink">
            Your closet,
            <br />
            <span className="text-crimson">digitized.</span>
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-ash">
            Upload your clothes, get AI outfit suggestions, and track your
            style over time.
          </p>
        </div>

        <p className="text-[11px] text-ash/50">
          &copy; {new Date().getFullYear()} WearWise
        </p>
      </div>

      {/* Form — white */}
      <div className="flex flex-1 items-center justify-center bg-paper px-5">
        <div className="w-full max-w-[320px]">
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <Sparkles className="size-5 text-rose" />
            <span className="text-[15px] font-bold text-ink">WearWise</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
