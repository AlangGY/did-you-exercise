"use client";

import BackNavBar from "@/components/layout/BackNavBar";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { useSessionJoinForm } from "@/hooks/useSessionJoinForm";

export function JoinSessionScreen({ sessionId }: { sessionId: number }) {
  const { form, onSubmit, EXERCISE_OPTIONS, isEtcChecked } =
    useSessionJoinForm(sessionId);

  return (
    <PageLayout>
      <Card>
        <BackNavBar />
        <CardHeader>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">합류한다잉!</h1>
        </CardHeader>
        <CardContent>
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
                    <FormLabel>주당 몇회 운동할꺼야?</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={7} {...field} />
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
                    <FormLabel>어떤 종류의 운동을 할꺼야?</FormLabel>
                    <div className="flex flex-wrap gap-3">
                      {EXERCISE_OPTIONS.map((option) => (
                        <FormField
                          key={option.value}
                          control={form.control}
                          name="exercises"
                          render={({ field }) => {
                            const checked = field.value?.includes(option.value);
                            return (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={checked}
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
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      {/* 기타 옵션은 마지막에 하드코딩 */}
                      <FormField
                        control={form.control}
                        name="exercises"
                        render={({ field }) => {
                          const checked = field.value?.includes("etc");
                          return (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={checked}
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
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                기타
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    {/* 기타 체크 시 인풋 노출 */}
                    {isEtcChecked && (
                      <FormField
                        control={form.control}
                        name="etcExercise"
                        rules={{ required: "기타 운동명을 입력하세요" }}
                        render={({ field }) => (
                          <FormItem className="mt-2">
                            <FormLabel>기타 운동명</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="쉼표(,)로 여러 개 입력 가능"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
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
                    <FormLabel>실패시 벌금(원)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step={1000} {...field} />
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
                    <FormLabel>특이사항</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full min-h-[80px] border border-gray-200 rounded-lg px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="특이사항이 있다면 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                세션 참가하기
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
