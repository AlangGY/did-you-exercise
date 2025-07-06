import { useQueries, useQuery } from "@tanstack/react-query";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { useSupabaseClient } from "../useSupabaseClient";

export type ParticipantProgress = {
  id: string;
  name: string;
  done: number;
  goal: number;
};

export function useSessionParticipants(sessionId: number) {
  const supabase = useSupabaseClient();

  // 1. 참가자 목록 쿼리
  const {
    data: participants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sessionParticipants", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_participant")
        .select("user_id, user_name, times_per_week")
        .eq("session_id", sessionId);
      if (error) throw error;
      return data ?? [];
    },
  });

  // 이번 주 시작/끝 날짜 구하기 (월요일 시작)
  const weekStart = format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );
  const weekEnd = format(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
    "yyyy-MM-dd"
  );

  // 2. 각 참가자별 금주 인증 횟수 쿼리 (병렬, DB에서 바로 집계)
  const doneQueries = useQueries({
    queries:
      participants?.map((p) => ({
        queryKey: [
          "participantDoneCount",
          sessionId,
          p.user_id,
          weekStart,
          weekEnd,
        ],
        queryFn: async () => {
          const { count, error } = await supabase
            .from("exercise_auth")
            .select("*", { count: "exact", head: true })
            .eq("session_id", sessionId)
            .eq("user_id", p.user_id)
            .gte("done_at", weekStart)
            .lte("done_at", weekEnd);
          if (error) throw error;
          return count ?? 0;
        },
        enabled: !!p.user_id,
      })) ?? [],
  });

  // 3. 참가자 + done 집계
  const result =
    participants?.map((p, i) => ({
      id: p.user_id,
      name: p.user_name,
      goal: p.times_per_week,
      done: doneQueries[i]?.data ?? 0,
    })) ?? [];

  return { data: result, isLoading, error };
}
