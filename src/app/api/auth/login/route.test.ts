import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/supabase-client", () => {
  return {
    supabase: {
      auth: {
        signInWithPassword: vi.fn(async ({ email, password }) => {
          if (email === "notfound@example.com") {
            return { error: { message: "User not found", status: 401 } };
          }
          if (password !== "password123") {
            return { error: { message: "Invalid password", status: 401 } };
          }
          return { error: null, data: { user: { id: "user-1", email } } };
        }),
      },
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/login", () => {
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

  it("존재하지 않는 이메일이거나 비밀번호가 틀리면 401을 반환한다", async () => {
    // 없는 이메일
    const req1 = {
      json: async () => ({
        email: "notfound@example.com",
        password: "password123",
      }),
    } as unknown as Request;
    const res1 = await POST(req1);
    expect(res1.status).toBe(401);
    const body1 = await res1.json();
    expect(body1.success).toBe(false);
    expect(typeof body1.error).toBe("string");
    // 비밀번호 틀림
    const req2 = {
      json: async () => ({ email: "test@example.com", password: "wrongpass" }),
    } as unknown as Request;
    const res2 = await POST(req2);
    expect(res2.status).toBe(401);
    const body2 = await res2.json();
    expect(body2.success).toBe(false);
    expect(typeof body2.error).toBe("string");
  });
});
