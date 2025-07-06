import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSupabaseClient } from "./useSupabaseClient";

export type LoginFormValues = {
  username: string;
  password: string;
};

export function useLoginForm() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const form = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const login = useCallback(
    async (data: LoginFormValues) => {
      // 실제 로그인 API 호출 등 구현
      const response = await supabase.auth.signInWithPassword({
        email: data.username,
        password: data.password,
      });
      if (response.error) {
        toast.error(`로그인에 실패했습니다. ${response.error.message}`);
        throw new Error(response.error.message);
      }
    },
    [supabase]
  );

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      await login(data);
      router.push("/");
    } catch {}
  };

  return {
    form,
    onSubmit,
  };
}
