import TabBar from "@/components/widget/TabBar";
import { OverlayProvider } from "@/lib/overlay-provider-client";
import Image from "next/image";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logoUrl = "/logo.svg";
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      {/* Nav bar */}
      <div className="fixed top-0 w-full bg-white shadow-sm px-6 z-10 h-28 flex">
        <h2 className="sr-only">운동해씀?</h2>
        <Image
          src={logoUrl}
          alt="운동해씀?"
          width={96}
          height={96}
          className="object-contain"
        />
      </div>
      <div className="w-full max-w-md px-1 pt-36 pb-24">{children}</div>
      <OverlayProvider />
      <TabBar />
    </div>
  );
}
