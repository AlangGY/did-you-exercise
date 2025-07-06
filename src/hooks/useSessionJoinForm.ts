import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import { useSupabaseClient } from "./useSupabaseClient";

export const EXERCISE_OPTIONS = [
  { label: "런닝", value: "런닝" },
  { label: "웨이트 트레이닝", value: "웨이트 트레이닝" },
  { label: "크로스핏", value: "크로스핏" },
  { label: "수영", value: "수영" },
  { label: "자전거", value: "자전거" },
  { label: "등산", value: "등산" },
  { label: "축구", value: "축구" },
  { label: "농구", value: "농구" },
  { label: "배구", value: "배구" },
  { label: "탁구", value: "탁구" },
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
      user_name: user.user_metadata.name,
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
