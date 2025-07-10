import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  endOfWeek,
  format,
  isBefore,
  max,
  min,
  parseISO,
  startOfWeek,
} from "date-fns";
import { useSupabaseClient } from "../useSupabaseClient";

export function useSessionWeeks(sessionId: number) {
  const supabase = useSupabaseClient();

  return useQuery<string[]>({
    queryKey: ["sessionWeeks", sessionId],
    queryFn: async () => {
      // 1. session 테이블에서 from, to 조회
      const { data, error } = await supabase
        .from("session")
        .select("from, to")
        .eq("id", sessionId)
        .single();
      if (error) throw error;
      if (!data) return [];
      const fromDate = parseISO(data.from);
      const toDate = parseISO(data.to);
      const today = format(new Date(), "yyyy-MM-dd");
      const weeks: string[] = [];
      let cursor = startOfWeek(fromDate, { weekStartsOn: 1 });
      while (
        isBefore(cursor, toDate) ||
        format(cursor, "yyyy-MM-dd") === format(toDate, "yyyy-MM-dd")
      ) {
        const weekStart = max([cursor, fromDate]);
        const weekEnd = min([endOfWeek(cursor, { weekStartsOn: 1 }), toDate]);
        weeks.push(
          `${format(weekStart, "yyyy-MM-dd")} ~ ${format(
            weekEnd,
            "yyyy-MM-dd"
          )}`
        );
        // 오늘이 포함된 주까지 반환
        if (parseISO(today) >= weekStart && parseISO(today) <= weekEnd) {
          break;
        }
        cursor = addDays(weekEnd, 1);
      }
      return weeks;
    },
  });
}
