import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ExerciseAuthModal from "@/components/widget/ExerciseAuthModal";
import { SessionModel } from "@/hooks/useJoinedSessionList";
import { User } from "@supabase/supabase-js";
import { CalendarDaysIcon, DumbbellIcon, UsersIcon } from "lucide-react";
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
  const isEnded = session.isEnded;

  return (
    <Card className="p-4 space-y-3 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base truncate">
              {session.title}
            </h3>
            {isEnded && (
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                종료
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDaysIcon className="w-3.5 h-3.5" />
            <span>
              {session.from} ~ {session.to}
            </span>
          </div>
        </div>

        {/* Action button */}
        {showJoinButton ? (
          session.isJoined ? (
            <Button size="sm" variant="outline" className="shrink-0" asChild>
              <Link href={`/session/${session.id}`}>상세보기</Link>
            </Button>
          ) : (
            <Button size="sm" className="shrink-0" asChild>
              <Link href={`/session/${session.id}/join`}>참가하기</Link>
            </Button>
          )
        ) : (
          <Button size="sm" variant="outline" className="shrink-0" asChild>
            <Link href={`/session/${session.id}`}>상세보기</Link>
          </Button>
        )}
      </div>

      {/* Participants */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <UsersIcon className="w-3.5 h-3.5" />
        <span className="truncate">
          {session.participants.map((p) => p.name).join(", ")}
        </span>
      </div>

      {/* Auth button for joined sessions */}
      {!showJoinButton && !isEnded && (
        <Button
          size="sm"
          className="w-full"
          onClick={() => {
            overlay.open(({ close, isOpen }) => (
              <ExerciseAuthModal
                sessionId={session.id}
                user={user as User}
                onClose={close}
                open={isOpen}
              />
            ));
          }}
        >
          <DumbbellIcon className="w-4 h-4" />
          오늘 운동 인증하기
        </Button>
      )}
    </Card>
  );
}
