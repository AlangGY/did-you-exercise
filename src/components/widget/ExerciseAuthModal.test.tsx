import { User } from "@supabase/supabase-js";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ExerciseAuthModal from "./ExerciseAuthModal";

const EXERCISE_OPTIONS = [
  { label: "런닝", value: "running" },
  { label: "수영", value: "swimming" },
  { label: "헬스", value: "health" },
];

describe("ExerciseAuthModal", () => {
  it("모달이 열리면 운동 종류 체크박스와 사진 업로드 필드가 보인다", async () => {
    const user = {
      id: "user-1",
      user_metadata: {
        name: "김철수",
      },
    };
    render(
      <ExerciseAuthModal
        open
        sessionId={1}
        user={user as unknown as User}
        onClose={() => {}}
      />
    );
    // 운동 종류 체크박스
    EXERCISE_OPTIONS.forEach((opt) => {
      expect(screen.getByLabelText(opt.label)).toBeDefined();
    });
    // 사진 업로드 필드
    expect(screen.getByLabelText(/인증 사진/i)).toBeDefined();
  });
});
