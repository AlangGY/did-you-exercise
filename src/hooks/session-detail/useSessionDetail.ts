import { useMyAuthHistory } from "./useMyAuthHistory";
import { useMyGoal } from "./useMyGoal";
import { useSessionParticipants } from "./useSessionParticipants";
import { useThisWeekAuthCount } from "./useThisWeekAuthCount";

export type MyGoal = {
  timesPerWeek: number;
  exercises: string[];
  penalty: number;
  notes: string;
};

export type ParticipantProgress = {
  id: string;
  name: string;
  done: number;
  goal: number;
};

export type AuthHistoryItem = {
  doneAt: string; // YYYY-MM-DD
  image: string; // 이미지 URL
  exercises: string[];
};

export function useSessionDetail(sessionId: number, userId?: string) {
  const myGoalQuery = useMyGoal(sessionId, userId);
  const myAuthHistoryQuery = useMyAuthHistory(sessionId, userId);
  const participantsQuery = useSessionParticipants(sessionId);
  const thisWeekCountQuery = useThisWeekAuthCount(sessionId, userId);

  return {
    myGoal: myGoalQuery.data,
    myAuthHistory: myAuthHistoryQuery.data,
    participants: participantsQuery.data,
    thisWeekCount: thisWeekCountQuery.data,
  };
}
