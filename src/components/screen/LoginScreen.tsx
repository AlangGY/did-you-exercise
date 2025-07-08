"use client";

import { KakaoLoginButton } from "@/components/widget/KakaoLoginButton";
import { useLoginForm } from "@/hooks/useLoginForm";
import Image from "next/image";

export function LoginScreen() {
  const { form, onSubmit } = useLoginForm();

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-6 pt-34 pb-24">
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt="logo"
            className="h-24 w-auto"
            width={100}
            height={100}
          />
        </div>
        {/* <Card className="p-2 shadow-md border-none">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800 sr-only">
            로그인
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      아이디
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <Input
                          {...field}
                          id="username"
                          placeholder="아이디를 입력하세요"
                          className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      비밀번호
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <Input
                          {...field}
                          id="password"
                          type="password"
                          placeholder="비밀번호를 입력하세요"
                          className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium !rounded-button"
              >
                로그인
              </Button>
            </form>
          </Form>
        </Card> */}
        <div className="mt-6 text-center space-y-4">
          <KakaoLoginButton />
          {/* <p className="text-gray-600 mb-4">아직 계정이 없으신가요?</p>
          <Button
            asChild
            variant="outline"
            className="w-full h-12 border-primary text-primary hover:bg-primary/10 font-medium !rounded-button"
          >
            <Link href="/auth/signup">회원가입</Link>
          </Button> */}
        </div>
      </div>
    </div>
  );
}
