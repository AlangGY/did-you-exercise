import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export type LoginFormValues = {
  username: string;
  password: string;
};

export function useLoginForm() {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const login = useCallback(async (data: LoginFormValues) => {
    // 실제 로그인 API 호출 등 구현
    console.log("Login with:", data);
  }, []);

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    login(data);
  };

  return {
    form,
    onSubmit,
  };
}
