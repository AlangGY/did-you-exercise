"use client";

import { KakaoLoginButton } from "@/components/widget/KakaoLoginButton";
import Image from "next/image";

export function LoginScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary/5 via-background to-background px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-10">
        {/* Hero area */}
        <div className="flex flex-col items-center gap-4 pt-8">
          <Image
            src="/logo.svg"
            alt="운동해씀?"
            className="h-20 w-auto drop-shadow-sm"
            width={100}
            height={100}
          />
          <p className="text-muted-foreground text-sm text-center">
            친구들과 함께하는 운동 인증 챌린지
          </p>
        </div>

        {/* Login area */}
        <div className="w-full space-y-4">
          <KakaoLoginButton />
        </div>
      </div>
    </div>
  );
}
