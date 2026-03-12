"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackNavBar({ title }: { title?: string }) {
  const router = useRouter();

  return (
    <header className="w-full py-2 flex items-center gap-3">
      <button
        className="cursor-pointer text-foreground/70 hover:text-foreground p-1 -ml-1 rounded-lg hover:bg-muted transition-colors"
        onClick={() => router.back()}
        aria-label="뒤로가기"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>
      {title && (
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      )}
    </header>
  );
}
