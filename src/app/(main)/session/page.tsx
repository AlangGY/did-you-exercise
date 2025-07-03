"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSessionList } from "@/hooks/useSessionList";
import Link from "next/link";

export default function SessionListPage() {
  const { sessions, myId } = useSessionList();

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">세션 목록</h1>
      <div className="space-y-4">
        {sessions.map((session) => {
          const isJoined = session.participants.some((p) => p.id === myId);
          return (
            <Card key={session.id} className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    {session.title}
                    {isJoined && (
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        참가중
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {session.from} ~ {session.to}
                  </p>
                </div>
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
    </div>
  );
}
