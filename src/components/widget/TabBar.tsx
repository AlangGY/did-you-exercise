"use client";

import { TAB_ITEMS } from "@/constants/tab";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-border/50 z-10">
      <div className="grid grid-cols-3 h-16 max-w-md mx-auto">
        {TAB_ITEMS.map(({ path, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={path}
              href={path}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  active ? "bg-primary/10" : ""
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span
                className={`text-[10px] ${active ? "font-semibold" : "font-medium"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
