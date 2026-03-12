"use client";

import PageLayout from "@/components/layout/PageLayout";
import SessionCard from "@/components/widget/SessionCard";
import { useAuth } from "@/hooks/useAuth";
import { useNewSessionList } from "@/hooks/useNewSessionList";
import { SparklesIcon } from "lucide-react";

export default function SessionListPage() {
  const { sessions } = useNewSessionList();
  const { user } = useAuth();

  return (
    <PageLayout>
      <div className="flex items-center gap-2">
        <SparklesIcon className="w-4 h-4 text-primary" />
        <h1 className="text-base font-bold">새로 열렸어요!</h1>
      </div>
      <div className="space-y-3">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              user={user}
              showJoinButton={true}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground text-sm">
            새로운 세션이 없어요
          </div>
        )}
      </div>
    </PageLayout>
  );
}
