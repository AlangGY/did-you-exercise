import TabBar from "@/components/widget/TabBar";
import { OverlayProvider } from "@/lib/overlay-provider-client";
import Image from "next/image";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background">
      {/* Compact header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-border/50 px-4 z-10 h-14 flex items-center">
        <Image
          src="/logo.svg"
          alt="운동해씀?"
          width={80}
          height={40}
          className="h-9 w-auto object-contain"
        />
        <h2 className="sr-only">운동해씀?</h2>
      </header>
      <main className="w-full max-w-md px-4 pt-18 pb-22">{children}</main>
      <OverlayProvider />
      <TabBar />
    </div>
  );
}
