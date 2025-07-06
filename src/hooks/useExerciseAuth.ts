import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { useSupabaseClient } from "./useSupabaseClient";

export interface SubmitExerciseAuthParams {
  sessionId: number;
  photo: File | null;
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
      let imageUrl: string | null = null;
      if (data.photo) {
        const filePath = `user-${user.id}/${Date.now()}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("exercise-auth-image")
          .upload(filePath, data.photo);
        if (uploadError) {
          return {
            success: false,
            error: "이미지 업로드 실패: " + uploadError.message,
          };
        }
        const { data: publicUrlData } = supabase.storage
          .from("exercise-auth-image")
          .getPublicUrl(uploadData.path);
        imageUrl = publicUrlData.publicUrl;
      }
      const { data: insertData, error } = await supabase
        .from("exercise_auth")
        .insert({
          session_id: data.sessionId,
          user_id: user.id,
          done_at: new Date().toISOString().slice(0, 10),
          image: imageUrl,
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
          imageUrl: insertData?.image ?? imageUrl,
        },
      };
    },
    [supabase, user]
  );

  return { submitAuth };
}
