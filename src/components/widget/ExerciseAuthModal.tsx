/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
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
import {
  CameraIcon,
  CheckCircle2Icon,
  DumbbellIcon,
  LoaderCircleIcon,
} from "lucide-react";
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
  photo: FileList | null;
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
    photo: string[] | null;
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
        photo: data.photo ? Array.from(data.photo) : [],
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
              photo: result.auth.imageUrls,
              memo: result.auth.memo,
            }
          : { exercises, photo: [], memo: data.memo }
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
      <DialogContent showCloseButton={false} className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DumbbellIcon className="w-5 h-5 text-primary" />
            오늘 운동 인증
          </DialogTitle>
        </DialogHeader>
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
  const photoList = watch("photo") as FileList | null;
  const photo: File[] = photoList ? Array.from(photoList) : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Photo upload */}
      <FormField
        control={control}
        name="photo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">인증 사진</FormLabel>
            <FormControl>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <CameraIcon className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {photo.length > 0
                    ? `${photo.length}장 선택됨`
                    : "사진을 선택하세요"}
                </span>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    field.onChange(e.target.files);
                  }}
                />
              </label>
            </FormControl>
            {photo.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {photo.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt="미리보기"
                    className="w-20 h-20 object-cover rounded-xl border"
                  />
                ))}
              </div>
            )}
          </FormItem>
        )}
      />

      {/* Exercise checkboxes */}
      <FormField
        control={control}
        name="exercises"
        rules={{ required: "운동 종류를 선택하세요" }}
        render={() => (
          <FormItem>
            <FormLabel className="text-sm font-medium">운동 종류</FormLabel>
            <div className="flex flex-wrap gap-2 pt-1">
              {exerciseOptions.map((opt) => (
                <FormField
                  key={opt.value}
                  control={control}
                  name="exercises"
                  render={({ field }) => {
                    const checked = field.value?.includes(opt.value);
                    return (
                      <label
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm cursor-pointer transition-colors ${
                          checked
                            ? "border-primary bg-primary/5 text-primary font-medium"
                            : "border-border bg-background text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          className="hidden"
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
                        {opt.label}
                      </label>
                    );
                  }}
                />
              ))}
              {/* 기타 */}
              <FormField
                control={control}
                name="exercises"
                render={({ field }) => {
                  const checked = field.value?.includes("etc");
                  return (
                    <>
                      <label
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm cursor-pointer transition-colors ${
                          checked
                            ? "border-primary bg-primary/5 text-primary font-medium"
                            : "border-border bg-background text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          className="hidden"
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
                        기타
                      </label>
                      {checked && (
                        <FormField
                          control={control}
                          name="etc"
                          rules={{ required: "기타 운동명을 입력하세요" }}
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="직접 입력"
                                  className="h-10"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </>
                  );
                }}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Memo */}
      <FormField
        control={control}
        name="memo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">메모</FormLabel>
            <FormControl>
              <Input placeholder="오늘 운동 한마디" className="h-10" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <DialogFooter className="flex gap-2 pt-2">
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="flex-1 h-11"
          disabled={loading}
        >
          닫기
        </Button>
        <Button type="submit" className="flex-1 h-11" disabled={loading}>
          {loading ? (
            <LoaderCircleIcon className="w-4 h-4 animate-spin" />
          ) : (
            "인증하기"
          )}
        </Button>
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
  submitted: { exercises: string[]; photo: string[] | null; memo: string };
  sessionId: number;
}) {
  const handleKakaoShare = useKakaoShare({
    photoUrl:
      submitted.photo && submitted.photo.length > 0
        ? submitted.photo[0]
        : undefined,
    exercises: submitted.exercises,
    memo: submitted.memo,
    sessionId,
    user: { name: userName },
  });

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {/* Success indicator */}
      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
        <CheckCircle2Icon className="w-8 h-8 text-emerald-500" />
      </div>
      <p className="text-lg font-bold">인증 완료!</p>

      {/* Summary */}
      <div className="w-full bg-muted/50 rounded-xl p-4 space-y-3">
        <div>
          <p className="text-[11px] text-muted-foreground mb-1">운동 종류</p>
          <div className="flex flex-wrap gap-1.5">
            {submitted.exercises.map((ex, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {ex}
              </Badge>
            ))}
          </div>
        </div>
        {submitted.photo && submitted.photo.length > 0 && (
          <div>
            <p className="text-[11px] text-muted-foreground mb-1">인증 사진</p>
            <div className="flex gap-2 flex-wrap">
              {submitted.photo.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="인증 사진"
                  className="w-20 h-20 object-cover rounded-xl border"
                />
              ))}
            </div>
          </div>
        )}
        {submitted.memo && (
          <div>
            <p className="text-[11px] text-muted-foreground mb-0.5">메모</p>
            <p className="text-sm">{submitted.memo}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="w-full space-y-2">
        <Button
          type="button"
          onClick={handleKakaoShare}
          className="w-full h-11 bg-[#FEE500] text-black font-semibold hover:bg-[#FDD835] border-none"
        >
          카카오톡으로 공유하기
        </Button>
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="w-full h-11"
        >
          닫기
        </Button>
      </div>
    </div>
  );
}
