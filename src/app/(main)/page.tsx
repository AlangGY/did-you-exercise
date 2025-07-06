"use client";

import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ExerciseAuthModal from "@/components/widget/ExerciseAuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useJoinedSessionList } from "@/hooks/useJoinedSessionList";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { overlay } from "overlay-kit";

export default function MainPage() {
  const { sessions } = useJoinedSessionList();
  const { user } = useAuth();
  return (
    <PageLayout title="참가한 세션">
      <div className="space-y-2">
        {sessions.map((session) => {
          return (
            <Card key={session.id} className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    {session.title}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {session.from} ~ {session.to}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/session/${session.id}`}>상세보기</Link>
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {session.participants.map((p) => p.name).join(", ")}
              </p>
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  overlay.open(({ close, isOpen }) => {
                    return (
                      <ExerciseAuthModal
                        sessionId={session.id}
                        user={user as User}
                        onClose={close}
                        open={isOpen}
                      />
                    );
                  });
                }}
              >
                오늘 운동 인증하기
              </Button>
            </Card>
          );
        })}
      </div>
    </PageLayout>
  );
}
