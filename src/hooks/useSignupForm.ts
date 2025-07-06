import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSupabaseClient } from "./useSupabaseClient";

export type SignupFormValues = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

export function useSignupForm() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const form = useForm<SignupFormValues>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const handleSignup = useCallback(
    async (data: SignupFormValues) => {
      const response = await supabase.auth.signUp({
        email: data.email,
        options: {
          data: {
            name: data.name,
          },
        },
        password: data.password,
      });
      if (response.error) {
        throw new Error(response.error.message);
      }
    },
    [supabase]
  );

  const onSubmit: SubmitHandler<SignupFormValues> = async (_data) => {
    try {
      await handleSignup(_data);
      toast.success("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      router.push("/auth/login");
    } catch (error) {
      toast.error(`회원가입에 실패했습니다. ${error}`);
    }
  };

  const emailRules = {
    required: "이메일을 입력하세요",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "올바른 이메일 형식이 아닙니다.",
    },
  };

  const passwordRules = {
    required: "비밀번호를 입력하세요",
    minLength: {
      value: 4,
      message: "비밀번호는 4자 이상이어야 합니다.",
    },
  };

  const confirmPasswordRules = {
    required: "비밀번호를 다시 입력하세요",
    validate: (value: string) =>
      value === form.getValues("password") || "비밀번호가 일치하지 않습니다.",
  };

  return {
    form,
    onSubmit,
    passwordRules,
    confirmPasswordRules,
    emailRules,
  };
}
