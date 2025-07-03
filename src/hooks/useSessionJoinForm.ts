import { useForm } from "react-hook-form";

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

export function useSessionJoinForm() {
  const form = useForm<JoinSessionFormValues>({
    defaultValues: {
      timesPerWeek: 3,
      exercises: [],
      penalty: 10000,
      etcExercise: "",
      notes: "",
    },
  });

  const isEtcChecked = form.watch("exercises")?.includes("etc");

  const onSubmit = (data: JoinSessionFormValues) => {
    let exercisesFinal = data.exercises.filter((v) => v !== "etc");
    if (data.etcExercise) {
      const etcList = data.etcExercise
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      exercisesFinal = [...exercisesFinal, ...etcList];
    }
    alert(JSON.stringify({ ...data, exercises: exercisesFinal }, null, 2));
    // 실제 참가 요청 처리 로직 추가
  };

  return {
    form,
    onSubmit,
    EXERCISE_OPTIONS,
    isEtcChecked,
  };
}
