import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { AuthHistoryItem } from "@/hooks/session-detail/useMyAuthHistory";
import { isSameDay, parseISO } from "date-fns";
import * as React from "react";
import { ko } from "react-day-picker/locale";

interface AuthCalendarProps {
  authHistory: AuthHistoryItem[];
}

function CustomDayButton(
  props: React.ComponentProps<typeof CalendarDayButton> & { authDates: Date[] }
) {
  const { day, authDates, ...rest } = props;
  const isAuth = authDates.some((d) => isSameDay(d, day.date));
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <CalendarDayButton day={day} {...rest} />
      {isAuth && (
        <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[8px] text-primary pointer-events-none">
          ●
        </span>
      )}
    </div>
  );
}

export default function AuthCalendar({ authHistory }: AuthCalendarProps) {
  const authDates = React.useMemo(
    () => authHistory.map((item) => parseISO(item.doneAt)),
    [authHistory]
  );
  return (
    <Calendar
      mode="single"
      showOutsideDays
      className="w-full"
      lang="ko"
      locale={ko}
      components={{
        DayButton: (props) => (
          <CustomDayButton {...props} authDates={authDates} />
        ),
      }}
    />
  );
}
