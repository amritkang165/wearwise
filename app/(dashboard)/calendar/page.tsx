import { getCalendarData } from "@/actions/calendar";
import { CalendarView } from "@/components/calendar/CalendarView";

export const metadata = {
  title: "Calendar — WearWise",
};

export default async function CalendarPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const data = await getCalendarData(year, month);

  return <CalendarView initialYear={year} initialMonth={month} initialData={data} />;
}
