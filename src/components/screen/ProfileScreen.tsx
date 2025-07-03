"use client";

import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

export function ProfileScreen() {
  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
    // 실제 로그아웃 로직(토큰 삭제 등)은 추후 구현
  };

  return (
    <PageLayout>
      <Button
        onClick={handleLogout}
        size="lg"
        variant="destructive"
        className="w-full"
      >
        로그아웃
      </Button>
    </PageLayout>
  );
}
