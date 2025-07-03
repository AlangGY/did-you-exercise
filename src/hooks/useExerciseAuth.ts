import { useCallback } from "react";

export function useExerciseAuth() {
  // 인증하기 함수 (목 구현)
  const submitAuth = useCallback(
    async (data: { photo: File | null; exercises: string[] }) => {
      console.log(data);
      // 실제 API 연동 전, 목 동작
      await new Promise((resolve) => setTimeout(resolve, 500));
      // 성공했다고 가정
      return { success: true };
    },
    []
  );

  return { submitAuth };
}
