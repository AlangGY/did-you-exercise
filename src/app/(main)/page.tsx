"use client";

import PageLayout from "@/components/layout/PageLayout";
import SessionCard from "@/components/widget/SessionCard";
import { useAuth } from "@/hooks/useAuth";
import { useJoinedSessionList } from "@/hooks/useJoinedSessionList";
import { useNewSessionList } from "@/hooks/useNewSessionList";

export default function MainPage() {
  const { sessions: newSessions } = useNewSessionList();
  const { sessions: joinedSessions } = useJoinedSessionList();
  const { user } = useAuth();
  return (
    <PageLayout>
      {newSessions.length > 0 && (
        <h2 className="text-2xl font-bold mb-4">새로운 세션</h2>
      )}
      <div className="space-y-2">
        {newSessions.map((session) => {
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
      <h2 className="text-2xl font-bold mb-4">참가한 세션</h2>
      <div className="space-y-2">
        {joinedSessions.map((session) => {
          return <SessionCard key={session.id} session={session} user={user} />;
        })}
      </div>
    </PageLayout>
  );
}
