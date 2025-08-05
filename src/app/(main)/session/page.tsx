"use client";

import PageLayout from "@/components/layout/PageLayout";
import SessionCard from "@/components/widget/SessionCard";
import { useAuth } from "@/hooks/useAuth";
import { useNewSessionList } from "@/hooks/useNewSessionList";

export default function SessionListPage() {
  const { sessions } = useNewSessionList();
  const { user } = useAuth();

  return (
    <PageLayout title="새로 열렸어요!">
      <div className="space-y-4">
        {sessions.map((session) => {
          return (
            <SessionCard
              key={session.id}
              session={session}
              user={user}
              showJoinButton={true}
            />
          );
        })}
      </div>
    </PageLayout>
  );
}
