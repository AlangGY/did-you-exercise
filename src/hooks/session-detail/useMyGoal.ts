import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "../useSupabaseClient";

export type MyGoal = {
  timesPerWeek: number;
  exercises: string[];
  penalty: number;
  notes: string;
};

export function useMyGoal(sessionId: number, userId?: string) {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["myGoal", sessionId, userId],
    queryFn: async (): Promise<MyGoal | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("session_participant")
        .select("times_per_week, exercises, penalty, notes")
        .eq("session_id", sessionId)
        .eq("user_id", userId)
        .single();
      if (error) throw error;
      return {
        timesPerWeek: data.times_per_week,
        exercises: data.exercises,
        penalty: data.penalty,
        notes: data.notes,
      };
    },
    enabled: !!userId,
  });
}
