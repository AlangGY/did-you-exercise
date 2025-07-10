import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "../useSupabaseClient";

export type ParticipantAuthHistoryItem = {
  doneAt: string; // YYYY-MM-DD
  image: string[]; // 이미지 URL 배열
  exercises: string[];
  memo?: string;
};

export function useParticipantAuthHistory(
  sessionId: number,
  userId?: string,
  weekStart?: string,
  weekEnd?: string
) {
  const supabase = useSupabaseClient();

  return useQuery<ParticipantAuthHistoryItem[]>({
    queryKey: ["participantAuthHistory", sessionId, userId, weekStart, weekEnd],
    queryFn: async () => {
      if (!userId || !weekStart || !weekEnd) return [];
      const { data, error } = await supabase
        .from("exercise_auth")
        .select("done_at, image, exercises, memo")
        .eq("session_id", sessionId)
        .eq("user_id", userId)
        .gte("done_at", weekStart)
        .lte("done_at", weekEnd)
        .order("done_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(
        (row: {
          done_at: string;
          image: string;
          exercises: string[];
          memo?: string;
        }) => ({
          doneAt: row.done_at,
          image: row.image ? row.image.split(",").filter(Boolean) : [],
          exercises: row.exercises,
          memo: row.memo,
        })
      );
    },
    enabled: !!userId && !!weekStart && !!weekEnd,
  });
}
