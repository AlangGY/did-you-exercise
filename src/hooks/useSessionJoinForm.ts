import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { useSupabaseClient } from "./useSupabaseClient";

export const EXERCISE_OPTIONS = [
  { label: "런닝", value: "running" },
  { label: "웨이트 트레이닝", value: "weight" },
  { label: "크로스핏", value: "crossfit" },
  { label: "수영", value: "swimming" },
  { label: "자전거", value: "cycling" },
  { label: "등산", value: "hiking" },
  { label: "축구", value: "soccer" },
  { label: "농구", value: "basketball" },
  { label: "배구", value: "volleyball" },
  { label: "탁구", value: "tabletennis" },
];

export type JoinSessionFormValues = {
  timesPerWeek: number;
  exercises: string[];
  penalty: number;
  etcExercise: string;
  notes: string;
};

export function useSessionJoinForm(sessionId: number) {
  const router = useRouter();
  const form = useForm<JoinSessionFormValues>({
    defaultValues: {
      timesPerWeek: 3,
      exercises: [],
      penalty: 10000,
      etcExercise: "",
      notes: "",
    },
  });
  const supabase = useSupabaseClient();
  const { user } = useAuth();

  const isEtcChecked = form.watch("exercises")?.includes("etc");

  const onSubmit = async (data: JoinSessionFormValues) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    let exercisesFinal = data.exercises.filter((v) => v !== "etc");
    if (data.etcExercise) {
      const etcList = data.etcExercise
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      exercisesFinal = [...exercisesFinal, ...etcList];
    }

    const { error } = await supabase.from("session_participant").insert({
      session_id: sessionId,
      user_id: user.id,
      user_name: user.email, // 필요시 user.name 등으로 변경
      times_per_week: data.timesPerWeek,
      exercises: exercisesFinal,
      penalty: data.penalty,
      notes: data.notes,
    });

    if (error) {
      toast.error("세션 참가에 실패했습니다: " + error.message);
      return;
    }
    toast.success("세션에 참가하였습니다!");
    router.push(`/session/${sessionId}`);
  };

  return {
    form,
    onSubmit,
    EXERCISE_OPTIONS,
    isEtcChecked,
  };
}
