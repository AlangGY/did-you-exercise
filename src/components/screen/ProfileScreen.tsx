"use client";

import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function ProfileScreen() {
  const { signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
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
