"use client";

import BackNavBar from "@/components/layout/BackNavBar";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProgressGradient from "@/components/ui/progress";
import AuthCalendar from "@/components/widget/AuthCalendar";
import ExerciseAuthModal from "@/components/widget/ExerciseAuthModal";
import { useSessionDetail } from "@/hooks/session-detail/useSessionDetail";
import { useAuth } from "@/hooks/useAuth";
import {
  ChevronRightIcon,
  DumbbellIcon,
  FlameIcon,
  TargetIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { overlay } from "overlay-kit";


export default function SessionDetailScreen({
  sessionId,
}: {
  sessionId: number;
}) {
  const { user } = useAuth();
  const { myGoal, myAuthHistory, participants, thisWeekCount, isEnded } =
    useSessionDetail(sessionId, user?.id);

  return (
    <PageLayout>
      <BackNavBar />

      {/* Auth CTA or ended badge */}
      {user && !isEnded ? (
        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={() => {
            overlay.open(({ close, isOpen }) => (
              <ExerciseAuthModal
                sessionId={sessionId}
                user={user}
                onClose={close}
                open={isOpen}
              />
            ));
          }}
        >
          <DumbbellIcon className="w-5 h-5" />
          오늘 운동 인증
        </Button>
      ) : (
        <Badge variant="secondary" className="w-fit">
          종료된 세션입니다
        </Badge>
      )}

      {/* This week progress */}
      {thisWeekCount !== undefined && myGoal && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <FlameIcon className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold">이번 주 운동 현황</h3>
            </div>
            <div className="flex items-center gap-3">
              <ProgressGradient
                value={(thisWeekCount / myGoal.timesPerWeek) * 100}
                className="flex-1 h-3"
              />
              <span className="text-sm font-bold text-primary tabular-nums">
                {thisWeekCount}/{myGoal.timesPerWeek}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      {myAuthHistory && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <TargetIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">운동 인증 현황</h3>
            </div>
            <AuthCalendar authHistory={myAuthHistory} />
          </CardContent>
        </Card>
      )}

      {/* My goal */}
      {myGoal && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <TrophyIcon className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold">내 목표</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-[11px] text-muted-foreground mb-0.5">
                  주당 목표
                </p>
                <p className="text-lg font-bold">
                  {myGoal.timesPerWeek}
                  <span className="text-sm font-normal text-muted-foreground">
                    회
                  </span>
                </p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-[11px] text-muted-foreground mb-0.5">
                  실패 벌금
                </p>
                <p className="text-lg font-bold">
                  {myGoal.penalty.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">
                    원
                  </span>
                </p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-[11px] text-muted-foreground mb-1">
                운동 종류
              </p>
              <div className="flex flex-wrap gap-1.5">
                {myGoal.exercises.map((ex) => (
                  <Badge key={ex} variant="secondary" className="text-xs">
                    {ex}
                  </Badge>
                ))}
              </div>
            </div>
            {myGoal.notes && (
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-[11px] text-muted-foreground mb-0.5">
                  특이사항
                </p>
                <p className="text-sm">{myGoal.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Participants */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">참가자 운동 현황</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground h-7 px-2"
              asChild
            >
              <Link href={`/session/${sessionId}/participants`}>
                자세히 보기
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {participants?.map((p) => (
              <div key={p.id} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {p.done}/{p.goal}회
                  </span>
                </div>
                <ProgressGradient
                  value={(p.done / p.goal) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
