import { isSameWeek, parseISO } from "date-fns";

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

// 운동 인증 현황 타입
export type AuthHistoryItem = {
  doneAt: string; // YYYY-MM-DD
  image: string; // 이미지 URL
  exercises: string[];
};

export function useSessionDetail(sessionId: number) {
  // 예시 데이터
  const myGoal: MyGoal = {
    timesPerWeek: 5,
    exercises: ["런닝", "웨이트 트레이닝"],
    penalty: 10000,
    notes: "아침에만 운동",
  };

  // 운동 인증 현황: 객체 배열
  const myAuthHistory: AuthHistoryItem[] = [
    {
      doneAt: "2025-07-01",
      image: "/sample-auth-1.jpg",
      exercises: ["런닝"],
    },
    {
      doneAt: "2025-07-03",
      image: "/sample-auth-2.jpg",
      exercises: ["웨이트 트레이닝"],
    },
    {
      doneAt: "2025-07-05",
      image: "/sample-auth-3.jpg",
      exercises: ["런닝", "웨이트 트레이닝"],
    },
    {
      doneAt: "2025-07-07",
      image: "/sample-auth-4.jpg",
      exercises: ["런닝"],
    },
    {
      doneAt: "2025-07-10",
      image: "/sample-auth-5.jpg",
      exercises: ["웨이트 트레이닝"],
    },
    {
      doneAt: "2025-07-13",
      image: "/sample-auth-6.jpg",
      exercises: ["런닝"],
    },
    {
      doneAt: "2025-07-15",
      image: "/sample-auth-7.jpg",
      exercises: ["웨이트 트레이닝"],
    },
  ];

  // 이번 주 인증 횟수 계산
  const thisWeekCount = myAuthHistory.filter((item) =>
    isSameWeek(parseISO(item.doneAt), new Date(), { weekStartsOn: 1 })
  ).length;

  const participants: ParticipantProgress[] = [
    {
      id: "user-1",
      name: "김철수",
      done: 3,
      goal: 5,
    },
    {
      id: "user-2",
      name: "이영희",
      done: 5,
      goal: 5,
    },
    {
      id: "user-3",
      name: "박민수",
      done: 2,
      goal: 4,
    },
  ];

  return { myGoal, myAuthHistory, participants, thisWeekCount };
}
