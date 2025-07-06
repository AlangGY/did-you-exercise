import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "../useSupabaseClient";

export type AuthHistoryItem = {
  doneAt: string; // YYYY-MM-DD
  image: string; // 이미지 URL
  exercises: string[];
};

export function useMyAuthHistory(sessionId: number, userId?: string) {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["myAuthHistory", sessionId, userId],
    queryFn: async (): Promise<AuthHistoryItem[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("exercise_auth")
        .select("done_at, image, exercises")
        .eq("session_id", sessionId)
        .eq("user_id", userId)
        .order("done_at", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(
        (row: { done_at: string; image: string; exercises: string[] }) => ({
          doneAt: row.done_at,
          image: row.image,
          exercises: row.exercises,
        })
      );
    },
    enabled: !!userId,
  });
}
