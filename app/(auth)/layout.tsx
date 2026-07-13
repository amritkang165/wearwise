import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      {/* Brand Panel */}
      <div className="relative hidden overflow-hidden bg-[#080808] lg:flex lg:flex-col lg:justify-between">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080808] via-[#0c0a06] to-[#120e04]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.06] blur-[120px]" />

        {/* Top */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Sparkles className="size-4 text-amber-500" />
            </div>
            <span className="text-sm font-medium tracking-wide text-white/80">
              WearWise
            </span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-start px-10 pb-8">
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Wear it
            <br />
            <span className="text-amber-500">wise.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/40">
            Your AI-powered wardrobe assistant. Upload, organize, and get
            intelligent outfit recommendations — all from clothes you already
            own.
          </p>
        </div>

        {/* Bottom features */}
        <div className="relative z-10 grid grid-cols-3 gap-px border-t border-white/[0.06]">
          {[
            { label: "AI Detection", desc: "Auto-categorize" },
            { label: "Outfit AI", desc: "Smart matches" },
            { label: "Analytics", desc: "Wear insights" },
          ].map((feature) => (
            <div key={feature.label} className="px-10 py-5">
              <p className="text-sm font-medium text-white/70">
                {feature.label}
              </p>
              <p className="mt-1 text-xs text-white/30">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Panel */}
      <div className="relative flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile brand (shown on small screens) */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between border-b border-border px-6 py-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10">
              <Sparkles className="size-3.5 text-amber-500" />
            </div>
            <span className="text-sm font-medium">WearWise</span>
          </div>
        </div>

        <div className="w-full max-w-[360px] pt-16 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
