"use client";

import BackNavBar from "@/components/layout/BackNavBar";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProgressGradient from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import AuthCalendar from "@/components/widget/AuthCalendar";
import ExerciseAuthModal from "@/components/widget/ExerciseAuthModal";
import { useSessionDetail } from "@/hooks/session-detail/useSessionDetail";
import { useAuth } from "@/hooks/useAuth";
import { overlay } from "overlay-kit";
import { Fragment } from "react";

export default function SessionDetailScreen({
  sessionId,
}: {
  sessionId: number;
}) {
  const { user } = useAuth();
  const { myGoal, myAuthHistory, participants, thisWeekCount } =
    useSessionDetail(sessionId, user?.id);
  return (
    <PageLayout>
      {/* 내 목표 카드 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <BackNavBar />
            {user && (
              <Button
                type="button"
                onClick={() => {
                  overlay.open(({ close, isOpen }) => {
                    return (
                      <ExerciseAuthModal
                        sessionId={sessionId}
                        user={user}
                        onClose={close}
                        open={isOpen}
                      />
                    );
                  });
                }}
              >
                오늘 운동 인증
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-base font-semibold mt-4 mb-2">
            이번 주 운동 현황
          </h3>
          {thisWeekCount && myGoal && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-gray-500">{thisWeekCount}회</span>
              <ProgressGradient
                value={(thisWeekCount / myGoal.timesPerWeek) * 100}
                className="flex-1 h-3"
              />
              <span className="text-xs text-gray-500">
                {myGoal.timesPerWeek}회
              </span>
            </div>
          )}

          {/* 운동 인증 달력 */}
          {myAuthHistory && (
            <div className="mt-8">
              <h4 className="text-sm font-semibold mb-2">운동 인증 현황</h4>
              <AuthCalendar authHistory={myAuthHistory} />
            </div>
          )}

          <h3 className="text-base font-bold mb-2">내 목표</h3>
          {myGoal && (
            <div className="mb-2 space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  주당 목표
                </label>
                <Input
                  readOnly
                  type="number"
                  value={`${myGoal.timesPerWeek}`}
                  className="bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  운동 종류
                </label>
                <Input
                  readOnly
                  value={myGoal.exercises.join(", ")}
                  className="bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  실패시 벌금
                </label>
                <Input
                  readOnly
                  value={`${myGoal.penalty.toLocaleString()}원`}
                  className="bg-gray-100"
                />
              </div>
              {myGoal.notes && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    특이사항
                  </label>
                  <textarea
                    readOnly
                    value={myGoal.notes}
                    className="w-full min-h-[40px] bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              )}
            </div>
          )}
          <Separator className="my-12" />
          {/* 참가자별 운동일 프로그래스바 */}
          <div className="space-y-4 mt-12">
            <h3 className="text-base font-semibold mb-2">운동 현황</h3>
            {participants?.map((p) => (
              <Fragment key={p.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-gray-500">
                    {p.done} / {p.goal}회
                  </span>
                </div>
                <ProgressGradient
                  value={(p.done / p.goal) * 100}
                  className="h-2"
                />
              </Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
