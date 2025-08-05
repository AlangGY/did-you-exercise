import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ExerciseAuthModal from "@/components/widget/ExerciseAuthModal";
import { SessionModel } from "@/hooks/useJoinedSessionList";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { overlay } from "overlay-kit";

interface SessionCardProps {
  session: SessionModel;
  user: User | null;
  showJoinButton?: boolean;
}

export default function SessionCard({
  session,
  user,
  showJoinButton = false,
}: SessionCardProps) {
  return (
    <Card className="p-4 flex flex-col gap-2">
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
          {showJoinButton ? (
            session.isJoined ? (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/session/${session.id}`}>상세보기</Link>
              </Button>
            ) : (
              <Button size="sm" variant="default" asChild>
                <Link href={`/session/${session.id}/join`}>참가하기</Link>
              </Button>
            )
          ) : (
            <Button variant="outline" asChild>
              <Link href={`/session/${session.id}`}>상세보기</Link>
            </Button>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-600">
        {session.participants.map((p) => p.name).join(", ")}
      </p>
      {!showJoinButton &&
        (session.isEnded ? (
          <p className="text-sm text-gray-500 italic">종료된 세션입니다</p>
        ) : (
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
        ))}
    </Card>
  );
}
