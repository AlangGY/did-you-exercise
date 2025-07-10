import { useCallback } from "react";

interface UseKakaoShareOptions {
  photoUrl?: string;
  exercises: string[];
  user: {
    name: string;
    avatarUrl?: string;
  };
  sessionId: number;
  memo?: string;
}

export function useKakaoShare({
  photoUrl,
  exercises,
  user,
  sessionId,
  memo,
}: UseKakaoShareOptions) {
  const handleKakaoShare = useCallback(async () => {
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${user.name} 운동 인증 완료!`,
        description: `오늘 운동 인증\n운동 종류: ${exercises.join(", ")}\n${
          memo ? `메모: ${memo}` : ""
        }`,
        ...(photoUrl
          ? {
              imageUrl: photoUrl,
            }
          : {}),
        link: {
          webUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/session/${sessionId}`,
        },
      },
      // 프로필 이미지 등 추가 정보는 카카오톡 API의 feed message profile 영역에 맞게 확장 가능
    });
  }, [photoUrl, exercises, user, memo, sessionId]);

  return handleKakaoShare;
}
