import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useSupabaseClient } from "./useSupabaseClient";

export type Participant = {
  id: string;
  name: string;
};

export type SessionModel = {
  id: number;
  title: string;
  from: string;
  to: string;
  participants: Participant[];
  isJoined: boolean;
};

export function useJoinedSessionList() {
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    async function fetchSessions() {
      setLoading(true);
      // user가 null일 경우 보호
      if (!user) {
        setSessions([]);
        setLoading(false);
        return;
      }
      // 1. 내가 참가한 세션 id 목록 조회
      const { data: joined, error: joinError } = await supabase
        .from("session_participant")
        .select("session_id")
        .eq("user_id", user.id);

      if (joinError || !joined) {
        setSessions([]);
        setLoading(false);
        return;
      }

      const sessionIds = joined.map((j) => j.session_id);

      if (sessionIds.length === 0) {
        setSessions([]);
        setLoading(false);
        return;
      }

      // 2. 세션 정보 + 참가자 목록 조인 조회
      const { data: sessionsData, error: sessionError } = await supabase
        .from("session")
        .select("id, title, from, to, session_participant (user_id, user_name)")
        .in("id", sessionIds);

      if (sessionError || !sessionsData) {
        setSessions([]);
        setLoading(false);
        return;
      }

      // 3. 데이터 가공
      const result: SessionModel[] = (sessionsData as unknown[]).map(
        (session) => {
          const s = session as {
            id: number;
            title: string;
            from: string;
            to: string;
            SessionParticipant?: unknown[];
          };
          return {
            id: s.id,
            title: s.title,
            from: s.from,
            to: s.to,
            participants: (s.SessionParticipant || []).map((p) => {
              const part = p as { user_id: string; user_name: string };
              return { id: part.user_id, name: part.user_name };
            }),
            isJoined: true,
          };
        }
      );

      setSessions(result);
      setLoading(false);
    }

    fetchSessions();
  }, [supabase, user]);

  return { sessions, loading };
}
