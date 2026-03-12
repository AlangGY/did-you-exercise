"use client";

import BackNavBar from "@/components/layout/BackNavBar";
import PageLayout from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { KakaoShareButton } from "@/components/widget/KakaoShareButton";
import { useParticipantAuthHistory } from "@/hooks/session-detail/useParticipantAuthHistory";
import { useSessionParticipantsStatus } from "@/hooks/session-detail/useSessionParticipantsStatus";
import { useSessionWeeks } from "@/hooks/session-detail/useSessionWeeks";
import { format, isWithinInterval, parseISO } from "date-fns";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  ImageIcon,
  XCircleIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const days = ["월", "화", "수", "목", "금", "토", "일"];

function parseWeekRange(weekRange: string) {
  const [weekStart, weekEnd] = weekRange.split(" ~ ");
  return { weekStart, weekEnd };
}

export function SessionParticipantsScreen({
  sessionId,
  week,
}: {
  sessionId: number;
  week?: string;
}) {
  const {
    data: { weeks: weekRanges } = { weeks: [], isEnded: false },
    isLoading: weeksLoading,
    error: weeksError,
  } = useSessionWeeks(sessionId);

  const [selectedWeek, setSelectedWeek] = useState<string | undefined>(
    week ?? undefined
  );
  if (!selectedWeek && weekRanges.length > 0) {
    setSelectedWeek(weekRanges[weekRanges.length - 1]);
  }

  const { weekStart, weekEnd } = selectedWeek
    ? parseWeekRange(selectedWeek)
    : { weekStart: "", weekEnd: "" };
  const {
    data: participants,
    isLoading,
    error,
  } = useSessionParticipantsStatus(sessionId, weekStart, weekEnd);
  const isTodayInWeek =
    weekStart &&
    weekEnd &&
    isWithinInterval(new Date(), {
      start: parseISO(weekStart),
      end: parseISO(weekEnd),
    });

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );
  if (!selectedUserId && participants && participants.length > 0) {
    setSelectedUserId(participants[0].id);
  }
  const {
    data: authHistory,
    isLoading: authLoading,
    error: authError,
  } = useParticipantAuthHistory(sessionId, selectedUserId, weekStart, weekEnd);

  const handleShare = () => {
    const isEveryBodySuccess = participants?.every((p) => p.success === "성공");
    const failedParticipants = participants?.filter(
      (p) => p.success === "실패"
    );
    const failedParticipantsString = failedParticipants
      ?.map(
        (p) => `${p.name} (${p.done}/${p.goal}) (${p.fine.toLocaleString()}원)`
      )
      .join("\n");
    const description = isEveryBodySuccess
      ? "모두 성공!"
      : `실패:\n ${failedParticipantsString}`;

    window.Kakao.Share.sendDefault({
      objectType: "text",
      text: `${weekStart} ~ ${weekEnd}\n${description}\n`,
      link: {
        webUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/session/${sessionId}/participants?week=${weekStart} ~ ${weekEnd}`,
      },
    });
  };

  return (
    <PageLayout>
      <div className="flex items-center justify-between">
        <BackNavBar title="주간 운동 현황" />
      </div>

      {/* Week selector */}
      <div className="flex items-center justify-between gap-2">
        {weeksLoading ? (
          <span className="text-muted-foreground text-sm">불러오는 중...</span>
        ) : weeksError ? (
          <span className="text-destructive text-sm">
            주차 정보를 불러올 수 없습니다
          </span>
        ) : (
          <div className="relative flex-1">
            <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              className="w-full appearance-none bg-muted/50 border border-border rounded-xl pl-9 pr-8 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
            >
              {weekRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        )}
        {!isTodayInWeek && participants && participants.length > 0 && (
          <KakaoShareButton onClick={handleShare} label="공유" />
        )}
      </div>

      {/* Participants cards */}
      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground text-sm">
          로딩 중...
        </div>
      ) : error ? (
        <div className="py-12 text-center text-destructive text-sm">
          데이터를 불러오지 못했습니다
        </div>
      ) : participants && participants.length > 0 ? (
        <div className="space-y-3">
          {participants.map((p) => {
            const isSuccess = p.success === "성공";
            const isFailed = p.success === "실패";
            return (
              <Card key={p.id}>
                <CardContent className="p-4 space-y-3">
                  {/* Name & status */}
                  <div className="flex items-center justify-between">
                    <button
                      className="font-semibold text-sm flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setSelectedUserId(p.id)}
                    >
                      {p.name}
                      {selectedUserId === p.id && (
                        <ImageIcon className="w-3.5 h-3.5 text-primary" />
                      )}
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium tabular-nums">
                        {p.done}/{p.goal}
                      </span>
                      {isSuccess && (
                        <Badge
                          variant="default"
                          className="text-[10px] bg-emerald-500 hover:bg-emerald-600"
                        >
                          성공
                        </Badge>
                      )}
                      {isFailed && (
                        <Badge variant="destructive" className="text-[10px]">
                          실패 ({p.fine.toLocaleString()}원)
                        </Badge>
                      )}
                      {!isSuccess && !isFailed && (
                        <Badge variant="secondary" className="text-[10px]">
                          진행중
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Day-by-day grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, idx) => {
                      const cellDate = format(
                        new Date(
                          new Date(weekStart).getTime() +
                            idx * 24 * 60 * 60 * 1000
                        ),
                        "yyyy-MM-dd"
                      );
                      const today = format(new Date(), "yyyy-MM-dd");
                      const didAuth = p.authPerDay[idx];
                      const isFuture = cellDate >= today && !didAuth;

                      return (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {day}
                          </span>
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              didAuth
                                ? "bg-emerald-50 text-emerald-600"
                                : isFuture
                                  ? "bg-muted/30 text-muted-foreground/30"
                                  : "bg-red-50 text-red-400"
                            }`}
                          >
                            {didAuth ? (
                              <CheckCircle2Icon className="w-4 h-4" />
                            ) : isFuture ? (
                              <span className="text-xs">-</span>
                            ) : (
                              <XCircleIcon className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center text-muted-foreground text-sm">
          참가자가 없습니다
        </div>
      )}

      {/* Auth history carousel */}
      {selectedUserId && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">인증 이력</h3>
              <select
                className="ml-auto appearance-none bg-muted/50 border border-border rounded-lg px-2 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                {participants?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {authLoading ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                불러오는 중...
              </div>
            ) : authError ? (
              <div className="py-8 text-center text-destructive text-sm">
                이력 조회 실패
              </div>
            ) : authHistory && authHistory.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {authHistory.map((item, idx) => (
                    <CarouselItem
                      key={idx}
                      className="flex flex-col items-center gap-3 p-2"
                    >
                      <Badge variant="outline" className="text-xs">
                        {item.doneAt}
                      </Badge>
                      {item.image && item.image.length > 0 && (
                        <div className="flex gap-2 flex-wrap justify-center">
                          {item.image.map((imgUrl, imgIdx) => (
                            <Image
                              key={imgIdx}
                              src={imgUrl}
                              width={160}
                              height={160}
                              alt="운동 인증 이미지"
                              className="w-36 h-36 object-cover rounded-xl border"
                            />
                          ))}
                        </div>
                      )}
                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium">
                          {item.exercises?.join(", ")}
                        </p>
                        {item.memo && (
                          <p className="text-xs text-muted-foreground">
                            {item.memo}
                          </p>
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm">
                인증 이력이 없습니다
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
