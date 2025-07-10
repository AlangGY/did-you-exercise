"use client";

import BackNavBar from "@/components/layout/BackNavBar";
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
import { CheckIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const days = ["월", "화", "수", "목", "금", "토", "일"];

function parseWeekRange(weekRange: string) {
  // "YYYY-MM-DD ~ YYYY-MM-DD" -> { weekStart, weekEnd }
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
    data: weekRanges = [],
    isLoading: weeksLoading,
    error: weeksError,
  } = useSessionWeeks(sessionId);
  // 금주까지만 필터링

  const [selectedWeek, setSelectedWeek] = useState<string | undefined>(
    week ?? undefined
  );
  // weekRanges가 바뀌면 자동으로 마지막(금주)로 선택
  // (최초 렌더링 시에도 적용)
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
  const isTodayInWeek = isWithinInterval(new Date(), {
    start: parseISO(weekStart),
    end: parseISO(weekEnd),
  });

  // 참가자 캐러셀용 state
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined
  );
  // participants가 바뀌면 자동으로 첫 번째 참가자 선택
  if (!selectedUserId && participants && participants.length > 0) {
    setSelectedUserId(participants[0].id);
  }
  const {
    data: authHistory,
    isLoading: authLoading,
    error: authError,
  } = useParticipantAuthHistory(sessionId, selectedUserId, weekStart, weekEnd);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeek(e.target.value);
  };

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
    <div>
      <div className="flex justify-between items-center mb-4 ">
        <BackNavBar />
        <div>
          {!isTodayInWeek && (
            <KakaoShareButton
              onClick={handleShare}
              label="현황 결과 공유하기"
            />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold">주간 운동 현황</h2>
        {weeksLoading ? (
          <span className="text-gray-400 text-sm">주차 불러오는 중...</span>
        ) : weeksError ? (
          <span className="text-red-400 text-sm">
            주차 정보를 불러올 수 없습니다.
          </span>
        ) : (
          <select
            className="border rounded px-2 py-1 text-sm"
            value={selectedWeek}
            onChange={handleChange}
          >
            {weekRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        )}
      </div>
      {isLoading ? (
        <div className="py-8 text-center text-gray-500">로딩 중...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          데이터를 불러오지 못했습니다.
        </div>
      ) : (
        <>
          <table className="min-w-full border text-center">
            <thead>
              <tr>
                <th className="border px-2 py-1">이름</th>
                {days.map((day) => (
                  <th key={day} className="border px-2 py-1">
                    {day}
                  </th>
                ))}
                <th className="border px-2 py-1">목표 달성</th>
                <th className="border px-2 py-1">벌금</th>
              </tr>
            </thead>
            <tbody>
              {participants && participants.length > 0 ? (
                participants.map((p) => (
                  <tr key={p.id}>
                    <td className="border px-2 py-1 font-medium">{p.name}</td>
                    {p.authPerDay.map((didAuth, idx) => {
                      // weekStart 기준 idx번째 요일의 날짜 계산
                      const cellDate = format(
                        new Date(
                          new Date(weekStart).getTime() +
                            idx * 24 * 60 * 60 * 1000
                        ),
                        "yyyy-MM-dd"
                      );
                      const today = format(new Date(), "yyyy-MM-dd");
                      if (cellDate >= today && !didAuth) {
                        return (
                          <td
                            key={idx}
                            className="border px-2 py-1 text-gray-400"
                          >
                            -
                          </td>
                        );
                      }
                      return (
                        <td key={idx} className="border px-2 py-1">
                          {didAuth ? (
                            <CheckIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <XIcon className="w-4 h-4 text-red-500" />
                          )}
                        </td>
                      );
                    })}
                    <td className="border px-2 py-1 font-semibold">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm">
                          {p.done}/{p.goal}
                        </span>
                        <span
                          className="text-xs"
                          style={{
                            color:
                              p.success === "성공"
                                ? "green"
                                : p.success === "실패"
                                ? "red"
                                : "gray",
                          }}
                        >
                          {p.success}
                        </span>
                      </div>
                    </td>
                    <td className="border px-2 py-1 font-semibold">
                      {p.success === "실패" && p.fine > 0
                        ? `${p.fine.toLocaleString()}원`
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={days.length + 3} className="py-8 text-gray-400">
                    참가자가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* 참가자별 인증 이력 캐러셀 */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">참가자 인증 이력</span>
              <select
                className="border rounded px-2 py-1 text-sm"
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
              <div className="py-4 text-center text-gray-400">
                이력 불러오는 중...
              </div>
            ) : authError ? (
              <div className="py-4 text-center text-red-400">
                이력 조회 실패
              </div>
            ) : authHistory && authHistory.length > 0 ? (
              <Carousel className="">
                <CarouselContent>
                  {authHistory.map((item, idx) => (
                    <CarouselItem
                      key={idx}
                      className="p-4 flex flex-col items-center gap-2"
                    >
                      <div className="text-xs text-gray-500">{item.doneAt}</div>
                      {item.image && item.image.length > 0 && (
                        <div className="flex gap-2 flex-wrap justify-center">
                          {item.image.map((imgUrl, imgIdx) => (
                            <Image
                              key={imgIdx}
                              src={imgUrl}
                              width={192}
                              height={192}
                              alt="운동 인증 이미지"
                              className="w-48 h-48 object-cover rounded border"
                            />
                          ))}
                        </div>
                      )}
                      <div className="text-sm font-medium">
                        {item.exercises?.join(", ")}
                      </div>
                      {item.memo && (
                        <div className="text-xs text-gray-400">
                          메모: {item.memo}
                        </div>
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="py-4 text-center text-gray-400">
                인증 이력이 없습니다.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
