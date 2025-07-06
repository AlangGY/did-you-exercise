"use client";

import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNewSessionList } from "@/hooks/useNewSessionList";
import Link from "next/link";

export default function SessionListPage() {
  const { sessions } = useNewSessionList();

  return (
    <PageLayout title="새로 열렸어요!">
      <div className="space-y-4">
        {sessions.map((session) => {
          return (
            <Card key={session.id} className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                {session.isJoined ? (
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/session/${session.id}`}>상세보기</Link>
                  </Button>
                ) : (
                  <Button size="sm" variant="default" asChild>
                    <Link href={`/session/${session.id}/join`}>참가하기</Link>
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {session.participants.map((p) => p.name).join(", ")}
              </p>
            </Card>
          );
        })}
      </div>
    </PageLayout>
  );
}
