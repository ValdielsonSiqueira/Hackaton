import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Check 
} from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";

interface DateTimePickerProps {
  value: string;
  onChange: (formattedValue: string) => void;
}

// Dynamic Locale Helpers using Intl.DateTimeFormat (pt-BR)
const getMonthName = (year: number, monthIndex: number) => {
  const name = new Date(year, monthIndex, 1).toLocaleDateString("pt-BR", { month: "long" });
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const WEEKDAY_NAMES = Array.from({ length: 7 }, (_, i) => {
  // Sunday 2026-03-01 through Saturday 2026-03-07
  const d = new Date(2026, 2, 1 + i);
  const shortName = d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
  return shortName.charAt(0).toUpperCase() + shortName.slice(1);
});

export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [timeString, setTimeString] = useState("18:00");
  const [isOpen, setIsOpen] = useState(false);

  // Calculate days in current month view
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSelectDay = (dayNumber: number) => {
    const newSelected = new Date(currentYear, currentMonth, dayNumber);
    setSelectedDate(newSelected);
    applySelection(newSelected, timeString);
  };

  const handleTimeChange = (newTime: string) => {
    setTimeString(newTime);
    applySelection(selectedDate, newTime);
  };

  const applySelection = (dateObj: Date, timeStr: string) => {
    const isToday =
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow =
      dateObj.getDate() === tomorrow.getDate() &&
      dateObj.getMonth() === tomorrow.getMonth() &&
      dateObj.getFullYear() === tomorrow.getFullYear();

    let formatted = "";
    if (isToday) {
      formatted = `HOJE ${timeStr}`;
    } else if (isTomorrow) {
      formatted = `AMANHÃ ${timeStr}`;
    } else {
      const dateString = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      formatted = `${dateString} às ${timeStr}`;
    }

    onChange(formatted);
  };

  const handleQuickPreset = (presetType: "today" | "tomorrow" | "next_week", time: string) => {
    const newDate = new Date(today);
    if (presetType === "tomorrow") {
      newDate.setDate(today.getDate() + 1);
    } else if (presetType === "next_week") {
      newDate.setDate(today.getDate() + 7);
    }
    setSelectedDate(newDate);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
    setTimeString(time);
    applySelection(newDate, time);
  };

  // Build grid calendar cells
  const calendarCells = [];
  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
    });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      date: new Date(currentYear, currentMonth, d),
    });
  }
  // Next month leading days to fill grid
  const totalCells = Math.ceil(calendarCells.length / 7) * 7;
  const nextMonthDays = totalCells - calendarCells.length;
  for (let n = 1; n <= nextMonthDays; n++) {
    calendarCells.push({
      day: n,
      isCurrentMonth: false,
      date: new Date(currentYear, currentMonth + 1, n),
    });
  }

  return (
    <div className="w-full">
      {/* Input Display Bar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 min-h-[48px] px-4 py-2 bg-[var(--canvas)] border-2 border-[var(--primary)] rounded text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-[var(--surface-1)] transition-colors focus-visible:outline-2 focus-visible:outline-[#0f62fe]"
          aria-expanded={isOpen}
          aria-label="Abrir seletor de data e hora"
        >
          <div className="flex items-center gap-2.5">
            <CalendarIcon className="w-5 h-5 text-[var(--primary)] shrink-0" />
            <span className="font-semibold text-sm sm:text-base text-[var(--ink)]">
              {value || "Selecione data e hora"}
            </span>
          </div>
          <span className="text-xs font-bold text-[var(--primary)] uppercase bg-[#e5edff] px-2.5 py-1 rounded">
            {isOpen ? "Fechar Calendário ▲" : "Calendário ▼"}
          </span>
        </button>
      </div>

      {/* Preset Quick Buttons */}
      <div className="flex gap-2 flex-wrap mb-3" aria-label="Atalhos rápidos de horário">
        <button
          type="button"
          onClick={() => handleQuickPreset("today", "18:00")}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold border cursor-pointer transition-colors ${
            value.startsWith("HOJE 18:00")
              ? "bg-[#0f62fe] text-white border-[#0f62fe]"
              : "bg-[var(--surface-1)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--canvas)]"
          }`}
        >
          HOJE 18:00
        </button>
        <button
          type="button"
          onClick={() => handleQuickPreset("today", "20:00")}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold border cursor-pointer transition-colors ${
            value.startsWith("HOJE 20:00")
              ? "bg-[#0f62fe] text-white border-[#0f62fe]"
              : "bg-[var(--surface-1)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--canvas)]"
          }`}
        >
          HOJE 20:00
        </button>
        <button
          type="button"
          onClick={() => handleQuickPreset("tomorrow", "09:00")}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold border cursor-pointer transition-colors ${
            value.startsWith("AMANHÃ 09:00")
              ? "bg-[#0f62fe] text-white border-[#0f62fe]"
              : "bg-[var(--surface-1)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--canvas)]"
          }`}
        >
          AMANHÃ 09:00
        </button>
        <button
          type="button"
          onClick={() => handleQuickPreset("tomorrow", "14:00")}
          className={`px-3 py-1.5 text-xs sm:text-sm font-semibold border cursor-pointer transition-colors ${
            value.startsWith("AMANHÃ 14:00")
              ? "bg-[#0f62fe] text-white border-[#0f62fe]"
              : "bg-[var(--surface-1)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--canvas)]"
          }`}
        >
          AMANHÃ 14:00
        </button>
      </div>

      {/* Accessible Interactive Calendar Drawer */}
      {isOpen && (
        <div className="bg-[var(--canvas)] border-2 border-[var(--primary)] rounded-lg shadow-2xl p-4 sm:p-5 my-3 w-full max-w-md mx-auto space-y-4">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-10 h-10 border border-[var(--hairline)] bg-[var(--surface-1)] hover:bg-[var(--primary)] hover:text-white rounded flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Mês anterior"
              title="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-base sm:text-lg font-bold text-[var(--ink)] tracking-wide">
              {getMonthName(currentYear, currentMonth)} {currentYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-10 h-10 border border-[var(--hairline)] bg-[var(--surface-1)] hover:bg-[var(--primary)] hover:text-white rounded flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Próximo mês"
              title="Próximo mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Labels Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs sm:text-sm text-[var(--ink-muted)] py-1">
            {WEEKDAY_NAMES.map((wd) => (
              <div key={wd}>{wd}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell, idx) => {
              const isSelected =
                cell.isCurrentMonth &&
                cell.date.getDate() === selectedDate.getDate() &&
                cell.date.getMonth() === selectedDate.getMonth() &&
                cell.date.getFullYear() === selectedDate.getFullYear();

              const isTodayCell =
                cell.isCurrentMonth &&
                cell.date.getDate() === today.getDate() &&
                cell.date.getMonth() === today.getMonth() &&
                cell.date.getFullYear() === today.getFullYear();

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!cell.isCurrentMonth}
                  onClick={() => cell.isCurrentMonth && handleSelectDay(cell.day)}
                  className={`h-10 sm:h-11 rounded font-bold text-xs sm:text-sm flex items-center justify-center transition-colors cursor-pointer border ${
                    !cell.isCurrentMonth
                      ? "text-[var(--ink-subtle)] border-transparent bg-transparent opacity-30 cursor-not-allowed"
                      : isSelected
                      ? "bg-[#0f62fe] text-white border-[#0f62fe] shadow"
                      : isTodayCell
                      ? "border-[#0f62fe] text-[#0f62fe] bg-[#e5edff] font-extrabold"
                      : "bg-[var(--surface-1)] text-[var(--ink)] border-[var(--hairline)] hover:bg-[var(--primary)] hover:text-white"
                  }`}
                  aria-label={cell.date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Time Picker Section */}
          <div className="pt-3 border-t border-[var(--hairline)] space-y-3">
            <label htmlFor="time-select-input" className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
              <Clock className="w-4 h-4 text-[var(--primary)]" /> Horário da Atividade:
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Input
                type="time"
                id="time-select-input"
                value={timeString}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="h-11 flex-1 font-bold text-base text-center sm:text-left"
              />
              <div className="flex gap-1.5 shrink-0">
                {["09:00", "14:00", "18:00", "20:00"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTimeChange(t)}
                    className={`px-2.5 py-2 text-xs font-bold border cursor-pointer ${
                      timeString === t
                        ? "bg-[#0f62fe] text-white border-[#0f62fe]"
                        : "bg-[var(--surface-1)] text-[var(--ink)] border-[var(--hairline)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Confirm Button inside Drawer */}
          <Button
            variant="primary"
            onClick={() => setIsOpen(false)}
            className="w-full h-11 flex items-center justify-center gap-2 font-bold text-sm mt-2"
          >
            <Check className="w-5 h-5" /> Confirmar Data e Hora
          </Button>
        </div>
      )}
    </div>
  );
};
