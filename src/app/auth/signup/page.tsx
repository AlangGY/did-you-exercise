"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignupForm } from "@/hooks/useSignupForm";
import { EyeIcon, EyeOffIcon, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { form, onSubmit, passwordRules, confirmPasswordRules } =
    useSignupForm();
  const isFormValid = form.formState.isValid;
  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main Content */}
      <main className="flex-1 px-6 pt-20 pb-24">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "이름을 입력하세요" }}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="text-base font-medium text-gray-800">
                      이름
                    </FormLabel>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      autoComplete="name"
                      autoFocus
                      placeholder="이름을 입력하세요"
                      className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              rules={passwordRules}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="text-base font-medium text-gray-800">
                      비밀번호
                    </FormLabel>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="password"
                        placeholder="비밀번호를 입력하세요"
                        className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              rules={confirmPasswordRules}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel className="text-base font-medium text-gray-800">
                      비밀번호 확인
                    </FormLabel>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="비밀번호를 다시 입력하세요"
                      className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert>
              <InfoIcon />
              <AlertDescription>
                회원가입 후 관리자 승인이 필요합니다. 승인 후에 로그인이
                가능합니다.
              </AlertDescription>
            </Alert>
            <Button
              type="submit"
              disabled={!isFormValid}
              className={`w-full h-14 text-lg font-medium !rounded-button ${
                isFormValid
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              회원가입
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
}
