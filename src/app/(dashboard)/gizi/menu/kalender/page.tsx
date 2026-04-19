"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import sdk from "@/lib";
import { formatLongDate, normaliseMealLabel } from "@/lib/admin-utils";
import {
  AdminPageHeading,
  OutlineAction,
  SurfaceCard,
} from "@/components/admin/ui";

const weekDays = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];
const mealTone: Record<string, string> = {
  SIANG: "bg-[#DCEAFE] text-[#0A6DDE]",
  SORE: "bg-[#ECE8FF] text-[#7C3AED]",
  PAGI: "bg-[#FFF4C7] text-[#D97706]",
};

type CalendarEntry = {
  date: string;
  day_of_month: number;
  menu_id: number;
  menu_name: string;
};

type SlotRow = Awaited<ReturnType<typeof sdk.menus.slots>>["data"][number];

export default function Page() {
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState<Date>(today);
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const month = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, "0")}`;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [calendarResponse, slotResponse] = await Promise.all([
          sdk.menuSchedules.calendarProjection({ month }),
          sdk.menus.slots(),
        ]);

        if (cancelled) return;

        const calendarData = Array.isArray(calendarResponse.data)
          ? (calendarResponse.data as CalendarEntry[])
          : calendarResponse.data
            ? [calendarResponse.data as CalendarEntry]
            : [];

        setCalendarEntries(calendarData);
        setSlots(slotResponse.data ?? []);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Gagal memuat kalender menu.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [viewDate]);

  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const offset = (startDay + 6) % 7;
  const previousMonthDays = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0).getDate();
  const isTodayVisible =
    viewDate.getFullYear() === today.getFullYear() &&
    viewDate.getMonth() === today.getMonth();

  const calendarCells = useMemo(() => {
    const cells: Array<{ key: string; day: number; currentMonth: boolean }> = [];

    for (let index = offset - 1; index >= 0; index -= 1) {
      cells.push({
        key: `prev-${index}`,
        day: previousMonthDays - index,
        currentMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ key: `current-${day}`, day, currentMonth: true });
    }

    while (cells.length < 42) {
      cells.push({
        key: `next-${cells.length}`,
        day: cells.length - daysInMonth - offset + 1,
        currentMonth: false,
      });
    }

    return cells;
  }, [daysInMonth, offset, previousMonthDays]);

  const selectedEntry = calendarEntries.find((entry) => entry.day_of_month === selectedDay);
  const selectedMeals = useMemo(() => {
    if (!selectedEntry) return [];
    return slots
      .filter((slot) => slot.menu_id === selectedEntry.menu_id)
      .map((slot) => {
        const label = normaliseMealLabel(slot.meal_time?.name);
        return {
          label,
          meal: slot.dish?.name ?? "-",
          tone: mealTone[label] ?? "bg-[#F8FAFC] text-[#475569]",
        };
      });
  }, [selectedEntry, slots]);

  return (
    <div className="space-y-5">
      <AdminPageHeading
        title="Kalender Menu"
        subtitle="Atur jadwal menu harian - Klik tanggal untuk melihat detail paket menu"
        action={
          <div className="flex gap-2">
            <OutlineAction
              onClick={() => {
                setViewDate(today);
                setSelectedDay(today.getDate());
              }}
            >
              Hari Ini
            </OutlineAction>
          </div>
        }
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <SurfaceCard className="overflow-hidden">
        <div className="flex items-center gap-3 border-b bg-[#F8FAFC] px-5 py-4">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B]"
            onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
            type="button"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#64748B]"
            onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
            type="button"
          >
            <ChevronRight size={14} />
          </button>
          <h3 className="text-base font-semibold text-[#16213E]">
            {viewDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
          </h3>
        </div>

        <div className="grid grid-cols-7 border-b border-[#E8EEF8] bg-white">
          {weekDays.map((day) => (
            <div key={day} className="border-r border-[#EEF2F7] px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {calendarCells.map((cell) => {
            const isSelected = cell.day === selectedDay && cell.currentMonth;
            const hasMenu = calendarEntries.some((entry) => entry.day_of_month === cell.day);
            const isCurrentToday = isTodayVisible && cell.currentMonth && cell.day === today.getDate();

            return (
              <button
                key={cell.key}
                onClick={() => {
                  if (cell.currentMonth) setSelectedDay(cell.day);
                }}
                className={`relative min-h-[86px] border-r border-b border-[#EEF2F7] px-4 py-3 text-left text-sm last:border-r-0 ${
                  isSelected ? "bg-[#DCEAFE]" : isCurrentToday ? "bg-[#F8FBFF]" : "bg-white hover:bg-[#F8FBFF]"
                }`}
                type="button"
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold ${
                    isSelected
                      ? "bg-[#2155CD] text-white"
                      : cell.currentMonth
                        ? "text-[#16213E]"
                        : "text-[#CBD5E1]"
                  }`}
                >
                  {cell.day}
                </span>
                {hasMenu && cell.currentMonth ? (
                  <span className="absolute bottom-3 right-3 h-2.5 w-2.5 rounded-full bg-[#2155CD]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </SurfaceCard>

      <SurfaceCard className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[#E8EEF8] bg-[#EDF5FF] px-5 py-4">
          <h3 className="text-base font-semibold text-[#16213E]">
            {selectedEntry ? formatLongDate(selectedEntry.date) : "Belum ada jadwal"}
          </h3>
          {selectedEntry ? (
            <span className="rounded-full bg-[#2155CD] px-2 py-0.5 text-[9px] font-bold text-white">
              AKTIF
            </span>
          ) : null}
        </div>
        <div className="grid gap-3 p-5 md:grid-cols-3">
          {selectedMeals.map((item) => (
            <div key={item.label} className={`rounded-[10px] px-4 py-4 ${item.tone}`}>
              <p className="text-[10px] font-bold">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-[#16213E]">{item.meal}</p>
              <p className="mt-1 text-xs text-[#64748B]">
                {selectedEntry?.menu_name ? `Bagian dari ${selectedEntry.menu_name}.` : "Belum ada paket aktif."}
              </p>
            </div>
          ))}
          {!loading && selectedMeals.length === 0 ? (
            <div className="col-span-full rounded-xl bg-[#F8FAFC] px-4 py-8 text-center text-sm text-gray-400">
              Belum ada komposisi menu pada tanggal ini.
            </div>
          ) : null}
        </div>
      </SurfaceCard>
    </div>
  );
}
