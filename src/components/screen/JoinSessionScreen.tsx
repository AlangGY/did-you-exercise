"use client";

import BackNavBar from "@/components/layout/BackNavBar";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSessionJoinForm } from "@/hooks/useSessionJoinForm";
import { DumbbellIcon } from "lucide-react";

export function JoinSessionScreen({ sessionId }: { sessionId: number }) {
  const { form, onSubmit, EXERCISE_OPTIONS, isEtcChecked } =
    useSessionJoinForm(sessionId);

  return (
    <PageLayout>
      <BackNavBar title="합류한다잉!" />

      <Card>
        <CardContent className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="timesPerWeek"
                rules={{
                  required: "주당 횟수를 입력하세요",
                  min: { value: 1, message: "최소 1회 이상" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      주당 몇회 운동할꺼야?
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={7}
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exercises"
                rules={{ required: "운동 종류를 선택하세요" }}
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      어떤 종류의 운동을 할꺼야?
                    </FormLabel>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {EXERCISE_OPTIONS.map((option) => (
                        <FormField
                          key={option.value}
                          control={form.control}
                          name="exercises"
                          render={({ field }) => {
                            const checked = field.value?.includes(option.value);
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
                                      field.onChange([
                                        ...field.value,
                                        option.value,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (v: string) => v !== option.value
                                        )
                                      );
                                    }
                                  }}
                                />
                                {option.label}
                              </label>
                            );
                          }}
                        />
                      ))}
                      {/* 기타 */}
                      <FormField
                        control={form.control}
                        name="exercises"
                        render={({ field }) => {
                          const checked = field.value?.includes("etc");
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
                                    field.onChange([...field.value, "etc"]);
                                  } else {
                                    field.onChange(
                                      field.value.filter(
                                        (v: string) => v !== "etc"
                                      )
                                    );
                                  }
                                }}
                              />
                              기타
                            </label>
                          );
                        }}
                      />
                    </div>
                    {isEtcChecked && (
                      <FormField
                        control={form.control}
                        name="etcExercise"
                        rules={{ required: "기타 운동명을 입력하세요" }}
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <FormControl>
                              <Input
                                placeholder="쉼표(,)로 여러 개 입력 가능"
                                className="h-11"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="penalty"
                rules={{
                  required: "벌금을 입력하세요",
                  min: { value: 0, message: "0원 이상 입력" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      실패시 벌금(원)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1000}
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      특이사항
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="특이사항이 있다면 입력하세요"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-12 text-base font-semibold">
                <DumbbellIcon className="w-5 h-5" />
                세션 참가하기
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
