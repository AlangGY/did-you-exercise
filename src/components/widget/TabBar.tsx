"use client";

import { TAB_ITEMS } from "@/constants/tab";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 grid grid-cols-3 h-16 z-10">
      {TAB_ITEMS.map(({ path, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={path}
            href={path}
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Icon
              className={`w-5 h-5 ${active ? "text-primary" : "text-gray-400"}`}
            />
            <span
              className={`text-xs mt-1 ${
                active ? "text-primary" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
