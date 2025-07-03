"use client";

import BackNavBar from "@/components/layout/BackNavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProgressGradient from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import ExerciseAuthModal from "@/components/widget/ExerciseAuthModal";
import { useSessionDetail } from "@/hooks/useSessionDetail";
import { overlay } from "overlay-kit";
import { Fragment } from "react";

export default function SessionDetailPage() {
  const { myGoal, participants } = useSessionDetail();
  return (
    <div className="w-full max-w-md mx-auto py-8 space-y-12">
      {/* 내 목표 카드 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <BackNavBar />
            <Button
              type="button"
              onClick={() => {
                overlay.open(({ close, isOpen }) => {
                  return (
                    <ExerciseAuthModal
                      exerciseOptions={myGoal.exercises.map((e) => ({
                        label: e,
                        value: e,
                      }))}
                      onClose={close}
                      open={isOpen}
                    />
                  );
                });
              }}
            >
              오늘 운동 인증
            </Button>
          </div>
          <h2 className="text-lg font-bold mb-2">내 목표</h2>
        </CardHeader>
        <CardContent>
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
          <h3 className="text-base font-semibold mt-4 mb-2">
            이번 주 운동 현황
          </h3>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs text-gray-500">{myGoal.done}회</span>
            <ProgressGradient
              value={(myGoal.done / myGoal.timesPerWeek) * 100}
              className="flex-1 h-3"
            />
            <span className="text-xs text-gray-500">
              {myGoal.timesPerWeek}회
            </span>
          </div>

          <Separator className="my-12" />
          {/* 참가자별 운동일 프로그래스바 */}
          <div className="space-y-4 mt-12">
            <h3 className="text-base font-semibold mb-2">운동 현황</h3>
            {participants.map((p) => (
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
    </div>
  );
}
