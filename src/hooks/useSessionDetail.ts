export type MyGoal = {
  timesPerWeek: number;
  done: number;
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

export function useSessionDetail() {
  // 예시 데이터
  const myGoal: MyGoal = {
    timesPerWeek: 5,
    done: 3,
    exercises: ["런닝", "웨이트 트레이닝"],
    penalty: 10000,
    notes: "아침에만 운동",
  };

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

  return { myGoal, participants };
}
