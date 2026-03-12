"use client";

import PageLayout from "@/components/layout/PageLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { LogOutIcon } from "lucide-react";

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
  };

  const userName =
    user?.user_metadata?.name || user?.email || "사용자";
  const initial = userName.charAt(0).toUpperCase();

  return (
    <PageLayout title="프로필">
      <Card>
        <CardContent className="p-5 space-y-5">
          {/* User info */}
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base">{userName}</p>
              {user?.email && (
                <p className="text-sm text-muted-foreground">{user.email}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5 h-11"
          >
            <LogOutIcon className="w-4 h-4" />
            로그아웃
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
