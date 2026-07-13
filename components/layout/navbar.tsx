"use client";

import { Menu } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-linen bg-paper px-5 lg:px-6">
      <button
        onClick={onMenuClick}
        className="flex size-8 items-center justify-center rounded-[8px] text-ash hover:text-ink lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-[13px] text-ash">
          {session?.user?.name ?? ""}
        </span>
        <div className="flex size-8 items-center justify-center rounded-full bg-rose text-[13px] font-semibold text-paper">
          {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  );
}
