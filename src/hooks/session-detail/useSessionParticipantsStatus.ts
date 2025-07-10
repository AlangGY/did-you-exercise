import { useQuery } from "@tanstack/react-query";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { useSupabaseClient } from "../useSupabaseClient";

export type ParticipantStatus = {
  id: string;
  name: string;
  goal: number;
  penalty: number;
  authPerDay: boolean[]; // length 7, 월~일
  done: number;
  success: "성공" | "실패" | "진행중";
  fine: number;
};

interface ParticipantRow {
  user_id: string;
  user_name: string;
  times_per_week: number;
  penalty: number;
}

interface AuthRow {
  user_id: string;
  done_at: string;
}

export function useSessionParticipantsStatus(
  sessionId: number,
  weekStart: string, // YYYY-MM-DD
  weekEnd: string // YYYY-MM-DD
) {
  const supabase = useSupabaseClient();

  return useQuery<ParticipantStatus[]>({
    queryKey: ["sessionParticipantsStatus", sessionId, weekStart, weekEnd],
    queryFn: async () => {
      // 1. 참가자 목록, 목표, 벌금 조회
      const { data: participants, error: pError } = await supabase
        .from("session_participant")
        .select("user_id, user_name, times_per_week, penalty")
        .eq("session_id", sessionId);
      if (pError) throw pError;
      if (!participants) return [];

      // 2. 해당 주의 날짜 배열 생성 (월~일)
      const days = eachDayOfInterval({
        start: parseISO(weekStart),
        end: parseISO(weekEnd),
      });

      console.log(days);
      // 3. 모든 참가자 인증 내역 조회 (이 주간 전체)
      const userIds = (participants as ParticipantRow[]).map((p) => p.user_id);
      const { data: auths, error: aError } = await supabase
        .from("exercise_auth")
        .select("user_id, done_at")
        .eq("session_id", sessionId)
        .in("user_id", userIds)
        .gte("done_at", weekStart)
        .lte("done_at", weekEnd);
      if (aError) throw aError;

      // 4. 참가자별 집계
      return (participants as ParticipantRow[]).map((p) => {
        // 해당 참가자의 인증 내역만 필터
        const myAuths = ((auths as AuthRow[]) ?? []).filter(
          (a) => a.user_id === p.user_id
        );
        // 요일별 인증 여부 (월~일)
        const authPerDay = days.map((d) =>
          myAuths.some(
            (a) =>
              format(parseISO(a.done_at), "yyyy-MM-dd") ===
              format(d, "yyyy-MM-dd")
          )
        );
        const done = myAuths.length;
        const goal = p.times_per_week;
        let success: "성공" | "실패" | "진행중" = "진행중";
        if (done >= goal) success = "성공";
        else if (days[days.length - 1] < new Date()) success = "실패";
        // 벌금: 실패일 때만 표시
        const fine = success === "실패" ? p.penalty * (goal - done) : 0;
        return {
          id: p.user_id,
          name: p.user_name,
          goal,
          penalty: p.penalty,
          authPerDay,
          done,
          success,
          fine,
        };
      });
    },
  });
}
