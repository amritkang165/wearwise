"use client";

interface LocalDateProps {
  date: string | Date;
  format?: "short" | "long";
}

export function LocalDate({ date, format = "short" }: LocalDateProps) {
  const d = new Date(date);
  const text =
    format === "long"
      ? d.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return <>{text}</>;
}
