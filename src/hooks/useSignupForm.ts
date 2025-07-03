import { SubmitHandler, useForm } from "react-hook-form";

export type SignupFormValues = {
  name: string;
  password: string;
  confirmPassword: string;
};

export function useSignupForm() {
  const form = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<SignupFormValues> = (_data) => {
    void _data;
    alert("회원가입이 요청되었습니다. 관리자 승인 후 로그인이 가능합니다.");
    // 실제 회원가입 처리 로직 추가
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
  };
}
