/* eslint-disable @next/next/no-img-element */
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useExerciseAuth } from "@/hooks/useExerciseAuth";
import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

interface ExerciseOption {
  label: string;
  value: string;
}

interface ExerciseAuthModalProps {
  open: boolean;
  exerciseOptions: ExerciseOption[];
  onClose: () => void;
}

interface ExerciseAuthFormValues {
  photo: File | null;
  exercises: string[];
  etc: string;
}

export default function ExerciseAuthModal({
  open,
  exerciseOptions,
  onClose,
}: ExerciseAuthModalProps) {
  const { submitAuth } = useExerciseAuth();
  const [step, setStep] = useState<"form" | "done">("form");
  const [submitted, setSubmitted] = useState<{
    exercises: string[];
    photo: File | null;
  }>({ exercises: [], photo: null });
  const [loading, setLoading] = useState(false);

  const methods = useForm<ExerciseAuthFormValues>({
    defaultValues: { photo: null, exercises: [], etc: "" },
  });

  if (!open) return null;

  const handleSubmit = async (data: ExerciseAuthFormValues) => {
    setLoading(true);
    let exercises = data.exercises.filter((v) => v !== "etc");
    if (data.exercises.includes("etc") && data.etc.trim()) {
      exercises = [...exercises, data.etc.trim()];
    }
    await submitAuth({ photo: data.photo, exercises });
    setSubmitted({ exercises, photo: data.photo });
    setStep("done");
    setLoading(false);
  };

  const handleClose = () => {
    setStep("form");
    setSubmitted({ exercises: [], photo: null });
    methods.reset();
    setLoading(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <FormProvider {...methods}>
          {step === "form" ? (
            <ExerciseAuthFormStep
              exerciseOptions={exerciseOptions}
              onSubmit={handleSubmit}
              onClose={handleClose}
              loading={loading}
            />
          ) : (
            <ExerciseAuthDoneStep onClose={handleClose} submitted={submitted} />
          )}
        </FormProvider>
      </div>
    </div>
  );
}

function ExerciseAuthFormStep({
  exerciseOptions,
  onSubmit,
  onClose,
  loading,
}: {
  exerciseOptions: ExerciseOption[];
  onSubmit: (data: ExerciseAuthFormValues) => void;
  onClose: () => void;
  loading: boolean;
}) {
  const { control, handleSubmit, watch } =
    useFormContext<ExerciseAuthFormValues>();
  const photo = watch("photo");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-bold mb-4">오늘 운동 인증</h2>
      <FormField
        control={control}
        name="photo"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>인증 사진</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  field.onChange(file);
                }}
              />
            </FormControl>
            {photo && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="미리보기"
                  className="w-full max-h-40 object-contain rounded border"
                />
              </div>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="exercises"
        rules={{ required: "운동 종류를 선택하세요" }}
        render={() => (
          <FormItem className="mb-4">
            <FormLabel>운동 종류</FormLabel>
            <div className="flex flex-col gap-2">
              {exerciseOptions.map((opt) => (
                <FormField
                  key={opt.value}
                  control={control}
                  name="exercises"
                  render={({ field }) => {
                    const checked = field.value?.includes(opt.value);
                    return (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(checked: boolean) => {
                              if (checked) {
                                field.onChange([...field.value, opt.value]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (v: string) => v !== opt.value
                                  )
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {opt.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              {/* 기타 항목 */}
              <FormField
                control={control}
                name="exercises"
                render={({ field }) => {
                  const checked = field.value?.includes("etc");
                  return (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              field.onChange([...field.value, "etc"]);
                            } else {
                              field.onChange(
                                field.value.filter((v: string) => v !== "etc")
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        기타
                      </FormLabel>
                      {checked && (
                        <FormField
                          control={control}
                          name="etc"
                          rules={{ required: "기타 운동명을 입력하세요" }}
                          render={({ field }) => (
                            <FormItem className="ml-2 flex-1">
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="직접 입력"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </FormItem>
                  );
                }}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          className="flex-1 py-2 rounded bg-primary text-white font-semibold"
          disabled={loading}
        >
          인증하기
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 rounded bg-gray-200"
          disabled={loading}
        >
          닫기
        </button>
      </div>
    </form>
  );
}

function ExerciseAuthDoneStep({
  onClose,
  submitted,
}: {
  onClose: () => void;
  submitted: { exercises: string[]; photo: File | null };
}) {
  // 카카오톡 공유 목 함수
  const handleKakaoShare = () => {
    alert("카카오톡 공유 기능은 추후 지원됩니다.");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
      <span className="text-2xl mb-4">🎉</span>
      <div className="text-lg font-bold mb-2">인증이 완료되었습니다!</div>
      <div className="w-full bg-gray-50 rounded p-3 mb-4 text-left">
        <div className="mb-2">
          <span className="font-semibold text-sm">운동 종류:</span>
          <ul className="list-disc ml-5 text-sm mt-1">
            {submitted.exercises.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
        {submitted.photo && (
          <div className="mt-2">
            <span className="font-semibold text-sm block mb-1">인증 사진:</span>
            <img
              src={URL.createObjectURL(submitted.photo)}
              alt="제출한 인증 사진"
              className="w-full max-h-40 object-contain rounded border"
            />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleKakaoShare}
        className="w-full py-2 rounded bg-[#FEE500] text-black font-semibold mb-2 border border-[#FEE500] hover:bg-[#ffe066] transition-colors"
      >
        카카오톡으로 공유하기
      </button>
      <button
        type="button"
        onClick={onClose}
        className="w-full py-2 rounded bg-primary text-white font-semibold"
      >
        닫기
      </button>
    </div>
  );
}
