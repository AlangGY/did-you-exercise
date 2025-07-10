/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSessionDetail } from "@/hooks/session-detail/useSessionDetail";
import { useExerciseAuth } from "@/hooks/useExerciseAuth";
import { useKakaoShare } from "@/hooks/useKakaoShare";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";

interface ExerciseOption {
  label: string;
  value: string;
}

interface ExerciseAuthModalProps {
  open: boolean;
  sessionId: number;
  user: User;
  onClose: () => void;
}

interface ExerciseAuthFormValues {
  photo: File | null;
  exercises: string[];
  etc: string;
  memo: string;
}

export default function ExerciseAuthModal({
  open,
  sessionId,
  user,
  onClose,
}: ExerciseAuthModalProps) {
  const { submitAuth } = useExerciseAuth();
  const { myGoal } = useSessionDetail(sessionId, user.id);
  const [step, setStep] = useState<"form" | "done">("form");
  const [submitted, setSubmitted] = useState<{
    exercises: string[];
    photo: string | null;
    memo: string;
  }>({ exercises: [], photo: null, memo: "" });
  const [loading, setLoading] = useState(false);

  const methods = useForm<ExerciseAuthFormValues>({
    defaultValues: { photo: null, exercises: [], etc: "", memo: "" },
  });

  const handleSubmit = async (data: ExerciseAuthFormValues) => {
    setLoading(true);
    let exercises = data.exercises.filter((v) => v !== "etc");
    if (data.exercises.includes("etc") && data.etc.trim()) {
      exercises = [...exercises, data.etc.trim()];
    }
    try {
      const result = await submitAuth({
        sessionId,
        photo: data.photo,
        exercises,
        memo: data.memo,
      });
      if (result.error) {
        throw new Error(result.error);
      }
      setSubmitted(
        result.auth
          ? {
              exercises: result.auth.exercises,
              photo: result.auth.imageUrl,
              memo: result.auth.memo,
            }
          : { exercises, photo: null, memo: data.memo }
      );
      setStep("done");
    } catch (error) {
      console.error(error);
      toast.error("인증 실패: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setSubmitted({ exercises: [], photo: null, memo: "" });
    methods.reset();
    setLoading(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>오늘 운동 인증</DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <FormProvider {...methods}>
            {step === "form" ? (
              myGoal && (
                <ExerciseAuthFormStep
                  exerciseOptions={myGoal.exercises.map((e) => ({
                    label: e,
                    value: e,
                  }))}
                  onSubmit={handleSubmit}
                  onClose={handleClose}
                  loading={loading}
                />
              )
            ) : (
              <ExerciseAuthDoneStep
                onClose={handleClose}
                userName={user?.user_metadata.name}
                submitted={submitted}
                sessionId={sessionId}
              />
            )}
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
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
      <FormField
        control={control}
        name="memo"
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>메모</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <DialogFooter>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={loading}>
            인증하기
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="flex-1"
            variant="outline"
            disabled={loading}
          >
            닫기
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

function ExerciseAuthDoneStep({
  onClose,
  userName,
  submitted,
  sessionId,
}: {
  onClose: () => void;
  userName: string;
  submitted: { exercises: string[]; photo: string | null; memo: string };
  sessionId: number;
}) {
  console.log(submitted.photo);
  const handleKakaoShare = useKakaoShare({
    photoUrl: submitted.photo ? submitted.photo : undefined,
    exercises: submitted.exercises,
    memo: submitted.memo,
    sessionId,
    user: {
      name: userName,
    },
  });
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
              src={submitted.photo}
              alt="제출한 인증 사진"
              className="w-full max-h-40 object-contain rounded border"
            />
          </div>
        )}
        {submitted.memo && (
          <div className="mt-2">
            <span className="font-semibold text-sm block mb-1">메모:</span>
            <div className="text-sm">{submitted.memo}</div>
          </div>
        )}
      </div>
      <Button
        id="kakao-share-button"
        type="button"
        onClick={handleKakaoShare}
        className="w-full py-2 rounded bg-[#FEE500] text-black font-semibold mb-2 border border-[#FEE500] hover:bg-[#ffe066] transition-colors"
      >
        카카오톡으로 공유하기
      </Button>
      <Button
        type="button"
        onClick={onClose}
        variant="outline"
        className="w-full"
      >
        닫기
      </Button>
    </div>
  );
}
