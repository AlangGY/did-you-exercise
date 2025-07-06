import { supabase } from "@/lib/supabase-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "이메일과 비밀번호를 입력하세요." },
      { status: 400 }
    );
  }
  // supabase 회원가입 처리
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    // 중복 이메일 등
    if (error.message.includes("already registered") || error.status === 409) {
      return NextResponse.json(
        { success: false, error: "이미 가입된 이메일입니다." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true });
}
