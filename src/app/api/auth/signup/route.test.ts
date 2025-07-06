import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

// 실제 API 핸들러 import는 추후 구현
// import { POST } from "./route";

vi.mock("@/lib/supabase-client", () => {
  let signupCalled: Record<string, boolean> = {};
  return {
    supabase: {
      auth: {
        signUp: vi.fn(async ({ email }) => {
          if (signupCalled[email]) {
            return { error: { message: "already registered", status: 409 } };
          }
          signupCalled[email] = true;
          return { error: null };
        }),
      },
    },
    // 테스트마다 상태 초기화
    __reset: () => {
      signupCalled = {};
    },
  };
});

beforeEach(async () => {
  // mock 상태 초기화
  const mod: unknown = await import("@/lib/supabase-client");
  if (typeof (mod as { __reset?: unknown }).__reset === "function") {
    (mod as { __reset: () => void }).__reset();
  }
});

describe("POST /api/auth/signup", () => {
  it("이메일, 비밀번호가 없으면 400을 반환한다", async () => {
    // given
    const req = { json: async () => ({}) } as unknown as Request;
    // when
    const res = await POST(req);
    // then
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(typeof body.error).toBe("string");
  });

  it("이메일, 비밀번호가 있으면 200과 { success: true }를 반환한다", async () => {
    // given
    const req = {
      json: async () => ({
        email: "test@example.com",
        password: "password123",
      }),
    } as unknown as Request;
    // when
    const res = await POST(req);
    // then
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("이미 가입된 이메일이면 409를 반환한다", async () => {
    // given
    const email = "duplicate@example.com";
    const req1 = {
      json: async () => ({ email, password: "password123" }),
    } as unknown as Request;
    const req2 = {
      json: async () => ({ email, password: "password123" }),
    } as unknown as Request;
    // when
    await POST(req1); // 첫 가입
    const res = await POST(req2); // 중복 가입
    // then
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(typeof body.error).toBe("string");
  });
});
