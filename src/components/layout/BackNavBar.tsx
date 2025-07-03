"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackNavBar({ title }: { title?: string }) {
  const router = useRouter();

  return (
    <header className="w-full z-10 px-4 py-3 flex items-center">
      <button
        className="cursor-pointer text-gray-700"
        onClick={() => router.back()}
        aria-label="뒤로가기"
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-medium text-center flex-1 mr-8">{title}</h1>
    </header>
  );
}
