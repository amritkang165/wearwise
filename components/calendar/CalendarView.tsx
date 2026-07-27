"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Shirt, Loader2 } from "lucide-react";
import type { CalendarDay } from "@/actions/calendar";
import { getCalendarData } from "@/actions/calendar";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

interface CalendarViewProps {
  initialYear: number;
  initialMonth: number;
  initialData: Record<string, CalendarDay>;
}

export function CalendarView({ initialYear, initialMonth, initialData }: CalendarViewProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [data, setData] = useState(initialData);
  const [isPending, startTransition] = useTransition();

  const loadMonth = (newYear: number, newMonth: number) => {
    startTransition(async () => {
      const fresh = await getCalendarData(newYear, newMonth);
      setData(fresh);
    });
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const prevMonth = () => {
    const m = month === 1 ? 12 : month - 1;
    const y = month === 1 ? year - 1 : year;
    setMonth(m);
    setYear(y);
    setSelectedDay(null);
    loadMonth(y, m);
  };

  const nextMonth = () => {
    const m = month === 12 ? 1 : month + 1;
    const y = month === 12 ? year + 1 : year;
    setMonth(m);
    setYear(y);
    setSelectedDay(null);
    loadMonth(y, m);
  };

  const selectedData = selectedDay ? data[selectedDay] : null;

  return (
    <div className="max-w-[768px] mx-auto px-4 py-10">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-semibold text-ink">
          {MONTH_NAMES[month - 1]} {year}
        </h1>
        <div className="flex items-center gap-1">
          {isPending && <Loader2 className="w-3.5 h-3.5 text-rose animate-spin" />}
          <button
            onClick={prevMonth}
            className="flex items-center justify-center w-8 h-8 rounded-full text-ash hover:text-ink hover:bg-canvas transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="flex items-center justify-center w-8 h-8 rounded-full text-ash hover:text-ink hover:bg-canvas transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d, i) => (
          <div
            key={`${d}-${i}`}
            className="py-1 text-center text-[11px] font-medium text-ash"
            style={{ fontFamily: "var(--font-label)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-11" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = formatDateKey(year, month, day);
          const dayData = data[key];
          const hasWear = dayData && dayData.wearLogs.length > 0;
          const hasOutfit = dayData && dayData.outfitLogs.length > 0;
          const isSelected = selectedDay === key;
          const isToday = key === todayKey;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : key)}
              className="h-11 flex flex-col items-center justify-start pt-1.5 gap-1 transition-colors hover:bg-canvas/60 rounded-lg"
            >
              <span
                className={`text-[14px] leading-none ${
                  isToday
                    ? "w-7 h-7 rounded-full bg-rose text-paper flex items-center justify-center font-semibold"
                    : isSelected
                      ? "text-rose font-semibold"
                      : "text-ink"
                }`}
              >
                {day}
              </span>
              {(hasWear || hasOutfit) && (
                <div className="flex gap-[3px]">
                  {hasWear && <div className="w-[5px] h-[5px] rounded-full bg-dust" />}
                  {hasOutfit && <div className="w-[5px] h-[5px] rounded-full bg-rose" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="mt-6 border-t border-linen pt-4">
          <p className="text-[13px] font-medium text-ink mb-3">
            {new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>

          {selectedData && (selectedData.outfitLogs.length > 0 || selectedData.wearLogs.length > 0) ? (
            <div className="space-y-2">
              {selectedData.outfitLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-canvas/60 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-rose shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-ink truncate">{log.outfit.name}</p>
                    {log.outfit.occasion && (
                      <p className="text-[11px] text-ash">{log.outfit.occasion}</p>
                    )}
                  </div>
                  <div className="flex -space-x-1.5">
                    {log.outfit.items.slice(0, 4).map((oi, j) => (
                      <div key={j} className="w-7 h-7 rounded-full overflow-hidden border-2 border-paper">
                        {oi.clothingItem.images.length > 0 ? (
                          <img src={oi.clothingItem.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-canvas flex items-center justify-center">
                            <Shirt className="w-3 h-3 text-dust/40" strokeWidth={1} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {selectedData.wearLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-canvas/60 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-dust shrink-0" />
                  <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-paper shrink-0">
                    {log.clothingItem.images.length > 0 ? (
                      <img src={log.clothingItem.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-canvas flex items-center justify-center">
                        <Shirt className="w-3 h-3 text-dust/40" strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-ink truncate">{log.clothingItem.name}</p>
                    <p className="text-[11px] text-ash">{log.clothingItem.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-ash py-2">Nothing logged</p>
          )}
        </div>
      )}
    </div>
  );
}
