"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  Sparkles,
  Calendar,
  BarChart3,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Wardrobe", href: "/wardrobe", icon: Shirt },
  { label: "Outfits", href: "/outfits", icon: Sparkles },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-linen bg-canvas transition-transform duration-150 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center px-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5"
            onClick={onClose}
          >
            <Sparkles className="size-5 text-rose" />
            <span className="text-[15px] font-bold tracking-tight text-ink">
              WearWise
            </span>
          </Link>

          <button
            onClick={onClose}
            className="ml-auto flex size-7 items-center justify-center rounded-md text-ash hover:text-ink lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-2">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] font-medium transition-colors",
                  active
                    ? "bg-rose/8 text-rose"
                    : "text-ash hover:text-ink hover:bg-canvas"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-linen p-3">
          <button
            onClick={() =>
              signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = "/sign-in";
                  },
                },
              })
            }
            className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-[13.5px] font-medium text-ash transition-colors hover:text-crimson"
          >
            <LogOut className="size-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
