export type Participant = {
  id: string;
  name: string;
};

export type SessionResponse = {
  id: number;
  title: string;
  from: string;
  to: string;
  participants: Participant[];
};

export type SessionModel = SessionResponse & {
  isJoined: boolean;
};

export function useNewSessionList() {
  // 본인 id(실제 서비스에서는 로그인 정보에서 가져와야 함)
  const myId = "user-1";

  // 예시 데이터 (SessionResponse[])
  const sessionResponses: SessionResponse[] = [
    {
      id: 1,
      title: "6월",
      from: "2025-06-01",
      to: "2025-06-30",
      participants: [
        { id: "user-1", name: "김철수" },
        { id: "user-2", name: "이영희" },
        { id: "user-3", name: "박민수" },
        { id: "user-4", name: "정수진" },
      ],
    },
    {
      id: 2,
      title: "7월",
      from: "2025-07-01",
      to: "2025-07-31",
      participants: [
        { id: "user-1", name: "김철수" },
        { id: "user-2", name: "이영희" },
        { id: "user-3", name: "박민수" },
      ],
    },
    {
      id: 3,
      title: "8월",
      from: "2025-08-01",
      to: "2025-08-31",
      participants: [
        { id: "user-2", name: "이영희" },
        { id: "user-3", name: "박민수" },
      ],
    },
  ];

  // SessionModel[]로 가공
  const sessions: SessionModel[] = sessionResponses.map((session) => ({
    ...session,
    isJoined: session.participants.some((p) => p.id === myId),
  }));

  return { sessions, myId };
}
