import { useQuery } from "@tanstack/react-query";
import { isSameWeek, parseISO } from "date-fns";
import { useSupabaseClient } from "../useSupabaseClient";

export function useThisWeekAuthCount(sessionId: number, userId?: string) {
  // exercise_auth에서 이번 주 인증 내역만 count
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["thisWeekAuthCount", sessionId, userId],
    queryFn: async (): Promise<number> => {
      if (!userId) return 0;
      const { data, error } = await supabase
        .from("exercise_auth")
        .select("done_at")
        .eq("session_id", sessionId)
        .eq("user_id", userId);
      if (error) throw error;
      const now = new Date();
      return (data ?? []).filter((row: { done_at: string }) =>
        isSameWeek(parseISO(row.done_at), now, { weekStartsOn: 1 })
      ).length;
    },
    enabled: !!userId,
  });
}
