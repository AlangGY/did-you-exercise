"use client";

import PageLayout from "@/components/layout/PageLayout";
import SessionCard from "@/components/widget/SessionCard";
import { useAuth } from "@/hooks/useAuth";
import { useJoinedSessionList } from "@/hooks/useJoinedSessionList";
import { useNewSessionList } from "@/hooks/useNewSessionList";
import { DumbbellIcon, SparklesIcon } from "lucide-react";

export default function MainPage() {
  const { sessions: newSessions } = useNewSessionList();
  const { sessions: joinedSessions } = useJoinedSessionList();
  const { user } = useAuth();

  return (
    <PageLayout>
      {/* New sessions */}
      {newSessions.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-primary" />
            <h2 className="text-base font-bold">새로운 세션</h2>
          </div>
          <div className="space-y-3">
            {newSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                user={user}
                showJoinButton={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Joined sessions */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <DumbbellIcon className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold">참가한 세션</h2>
        </div>
        <div className="space-y-3">
          {joinedSessions.length > 0 ? (
            joinedSessions.map((session) => (
              <SessionCard key={session.id} session={session} user={user} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              아직 참가한 세션이 없어요
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
