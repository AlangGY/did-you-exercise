import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "이메일과 비밀번호를 입력하세요." },
      { status: 400 }
    );
  }
  // 실제 로그인 로직은 추후 구현
  return NextResponse.json({ success: true });
}
