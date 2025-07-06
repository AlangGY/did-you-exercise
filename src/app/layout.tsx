import { Toaster } from "@/components/ui/sonner";
import KakaoClient from "@/components/widget/KakaoClient";
import { QueryClientProvider } from "@/components/widget/QueryClientProvider";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import React from "react";
import "./globals.css";

const fonts = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "700"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "운동해씀?",
  description: "운동 인증 서비스",

  // 기본 메타데이터
  keywords: "운동, 운동 인증, 운동 기록, 운동 데이터",
  authors: [{ name: "운동해씀?" }],
  creator: "Alang Kim",
  publisher: "Alang Kim",

  // 오픈그래프 메타데이터 (소셜 미디어 공유용)
  openGraph: {
    title: "운동해씀?",
    description: "운동 인증 서비스",
    url: "https://easily.jojicompany.com",
    siteName: "운동해씀?",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og.jpg", // 대표 이미지 URL
        alt: "운동해씀? 서비스",
      },
    ],
  },

  // 트위터 카드
  twitter: {
    card: "summary_large_image",
    title: "운동해씀?",
    description: "운동 인증 서비스",
    images: ["/og.jpg"],
  },

  // 기존 robots 설정 유지
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <KakaoClient />
      <body
        className={cn(
          fonts.className,
          "min-h-dvh bg-background font-sans antialiased"
        )}
      >
        <QueryClientProvider>{children}</QueryClientProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
