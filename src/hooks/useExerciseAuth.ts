import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useSupabaseClient } from "./useSupabaseClient";

export interface SubmitExerciseAuthParams {
  sessionId: number;
  photo: File[] | null;
  exercises: string[];
  memo?: string;
}

export function useExerciseAuth() {
  const supabase = useSupabaseClient();
  const { user } = useAuth();

  const submitAuth = useCallback(
    async (data: SubmitExerciseAuthParams) => {
      if (!user) {
        return { success: false, error: "로그인이 필요합니다." };
      }
      const imageUrls: string[] = [];
      if (data.photo && data.photo.length > 0) {
        let idx = 0;
        for (const file of data.photo) {
          const filePath = `user-${user.id}/${Date.now()}-${idx}`;
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("exercise-auth-image")
              .upload(filePath, file);
          if (uploadError) {
            return {
              success: false,
              error: "이미지 업로드 실패: " + uploadError.message,
            };
          }
          const { data: publicUrlData } = supabase.storage
            .from("exercise-auth-image")
            .getPublicUrl(uploadData.path);
          if (publicUrlData?.publicUrl) {
            imageUrls.push(publicUrlData.publicUrl);
          }
          idx++;
        }
      }
      // 자정~4시 이전 인증은 done_at을 하루 전 날짜로 저장
      const now = new Date();
      const doneDate = new Date(now);
      if (now.getHours() < 4) {
        doneDate.setDate(doneDate.getDate() - 1);
      }
      const year = doneDate.getFullYear();
      const month = String(doneDate.getMonth() + 1).padStart(2, "0");
      const day = String(doneDate.getDate()).padStart(2, "0");
      const doneAt = `${year}-${month}-${day}`;

      const { data: insertData, error } = await supabase
        .from("exercise_auth")
        .insert({
          session_id: data.sessionId,
          user_id: user.id,
          done_at: doneAt,
          image: imageUrls.join(","),
          exercises: data.exercises,
          memo: data.memo ?? null,
        })
        .select()
        .single();
      if (error) {
        return { success: false, error: error.message };
      }
      return {
        success: true,
        auth: {
          exercises: insertData?.exercises ?? data.exercises,
          imageUrls,
          memo: insertData?.memo ?? data.memo,
        },
      };
    },
    [supabase, user]
  );

  return { submitAuth };
}
