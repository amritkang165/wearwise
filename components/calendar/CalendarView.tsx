"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Shirt, Layers, Loader2 } from "lucide-react";
import type { CalendarDay } from "@/actions/calendar";
import { getCalendarData } from "@/actions/calendar";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    setSelectedDay(null);
    loadMonth(newYear, newMonth);
  };

  const nextMonth = () => {
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    setSelectedDay(null);
    loadMonth(newYear, newMonth);
  };

  const selectedData = selectedDay ? data[selectedDay] : null;
  const hasWearLogs = selectedData && (selectedData.wearLogs.length > 0 || selectedData.outfitLogs.length > 0);

  return (
    <div className="max-w-[960px] mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-[26px] font-semibold text-ink tracking-tight">
          Calendar
        </h1>
        <p
          className="mt-1.5 text-[12px] tracking-[0.04em] text-ash"
          style={{ fontFamily: "var(--font-label)" }}
        >
          WHAT YOU WORE AND WHEN
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Calendar grid */}
        <div className="bg-paper border border-linen rounded-[10px] overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between p-4 border-b border-linen">
            <button
              onClick={prevMonth}
              className="flex items-center justify-center w-8 h-8 rounded-[8px] text-ash hover:text-ink hover:bg-canvas transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span
              className="text-[14px] font-semibold text-ink"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {MONTH_NAMES[month - 1]} {year}
            </span>
            <div className="flex items-center gap-2">
              {isPending && <Loader2 className="w-3.5 h-3.5 text-rose animate-spin" />}
              <button
                onClick={nextMonth}
                className="flex items-center justify-center w-8 h-8 rounded-[8px] text-ash hover:text-ink hover:bg-canvas transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-linen">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-[11px] font-medium text-ash"
                style={{ fontFamily: "var(--font-label)" }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const key = formatDateKey(year, month, day);
              const dayData = data[key];
              const hasLogs = dayData && (dayData.wearLogs.length > 0 || dayData.outfitLogs.length > 0);
              const isSelected = selectedDay === key;
              const isToday = key === todayKey;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : key)}
                  className={`aspect-square relative flex flex-col items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? "bg-rose/10"
                      : hasLogs
                        ? "hover:bg-canvas/80"
                        : "hover:bg-canvas/50"
                  }`}
                >
                  <span
                    className={`text-[13px] tabular-nums ${
                      isToday
                        ? "w-6 h-6 rounded-full bg-rose text-paper flex items-center justify-center font-semibold"
                        : isSelected
                          ? "text-rose font-semibold"
                          : "text-ink"
                    }`}
                  >
                    {day}
                  </span>
                  {hasLogs && (
                    <div className="flex gap-0.5">
                      {dayData.wearLogs.length > 0 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-dust" />
                      )}
                      {dayData.outfitLogs.length > 0 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-rose" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail panel */}
        <div className="space-y-4">
          {selectedDay && selectedData ? (
            <div className="bg-paper border border-linen rounded-[10px] p-4 space-y-4">
              <div>
                <p
                  className="text-[11px] tracking-[0.14em] uppercase text-ash"
                  style={{ fontFamily: "var(--font-label)" }}
                >
                  {new Date(selectedDay + "T12:00:00").toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Outfit logs */}
              {selectedData.outfitLogs.length > 0 && (
                <div className="space-y-2">
                  <p
                    className="text-[10px] tracking-[0.14em] uppercase text-ash"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    OUTFITS WORN
                  </p>
                  {selectedData.outfitLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-lg border border-linen p-3 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-rose" />
                        <p className="text-[13px] font-medium text-ink truncate">
                          {log.outfit.name}
                        </p>
                      </div>
                      {log.outfit.occasion && (
                        <p
                          className="text-[10px] tracking-[0.08em] text-ash"
                          style={{ fontFamily: "var(--font-label)" }}
                        >
                          {log.outfit.occasion}
                        </p>
                      )}
                      <div className="flex gap-1.5">
                        {log.outfit.items.map((oi, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-md overflow-hidden border border-linen"
                          >
                            {oi.clothingItem.images.length > 0 ? (
                              <img
                                src={oi.clothingItem.images[0]}
                                alt={oi.clothingItem.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-canvas flex items-center justify-center">
                                <Shirt className="w-3.5 h-3.5 text-dust/40" strokeWidth={1} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Individual wear logs */}
              {selectedData.wearLogs.length > 0 && (
                <div className="space-y-2">
                  <p
                    className="text-[10px] tracking-[0.14em] uppercase text-ash"
                    style={{ fontFamily: "var(--font-label)" }}
                  >
                    ITEMS WORN
                  </p>
                  {selectedData.wearLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 rounded-lg border border-linen p-2.5"
                    >
                      <div className="w-9 h-9 rounded-md overflow-hidden border border-linen shrink-0">
                        {log.clothingItem.images.length > 0 ? (
                          <img
                            src={log.clothingItem.images[0]}
                            alt={log.clothingItem.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-canvas flex items-center justify-center">
                            <Shirt className="w-3.5 h-3.5 text-dust/40" strokeWidth={1} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-ink truncate">
                          {log.clothingItem.name}
                        </p>
                        <p
                          className="text-[10px] tracking-[0.08em] text-ash"
                          style={{ fontFamily: "var(--font-label)" }}
                        >
                          {log.clothingItem.category}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : selectedDay ? (
            <div className="bg-paper border border-linen rounded-[10px] p-6 flex flex-col items-center justify-center text-center">
              <p className="text-[13px] text-ash">Nothing logged this day</p>
            </div>
          ) : (
            <div className="bg-paper border border-linen rounded-[10px] p-6 flex flex-col items-center justify-center text-center">
              <Calendar className="w-8 h-8 text-dust/40 mb-3" strokeWidth={1.25} />
              <p className="text-[13px] text-ash">Select a day to see details</p>
            </div>
          )}

          {/* Legend */}
          <div className="bg-paper border border-linen rounded-[10px] p-4 space-y-2">
            <p
              className="text-[10px] tracking-[0.14em] uppercase text-ash"
              style={{ fontFamily: "var(--font-label)" }}
            >
              LEGEND
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-dust" />
                <span className="text-[12px] text-ink">Items worn</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose" />
                <span className="text-[12px] text-ink">Outfit worn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
    </svg>
  );
}
