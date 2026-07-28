import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Check } from "lucide-react-native";
import type { MobileThemeColors } from "../theme/mobileTheme";

interface DateTimePickerMobileProps {
  value: string;
  onChange: (formattedValue: string) => void;
  theme: { colors: MobileThemeColors; fontScale: number };
  triggerToast?: (msg: string) => void;
}

const getMonthName = (year: number, monthIndex: number) => {
  const name = new Date(year, monthIndex, 1).toLocaleDateString("pt-BR", { month: "long" });
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const WEEKDAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const TIME_PRESETS = ["08:00", "10:00", "12:00", "14:00", "18:00", "20:00"];

export const DateTimePickerMobile: React.FC<DateTimePickerMobileProps> = ({
  value,
  onChange,
  theme,
  triggerToast,
}) => {
  const { colors, fontScale } = theme;
  const isHighContrast = colors.mode === "high";
  const primaryAccentColor = isHighContrast ? colors.primary : "#0F62FE";

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [timeString, setTimeString] = useState("18:00");
  const [customTime, setCustomTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

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
      const dd = String(dateObj.getDate()).padStart(2, "0");
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const yyyy = dateObj.getFullYear();
      formatted = `${dd}/${mm}/${yyyy} ${timeStr}`;
    }

    onChange(formatted);
    if (triggerToast) {
      triggerToast(`🗓️ Ajustado para: ${formatted}`);
    }
  };

  const handleSelectDay = (dayNumber: number) => {
    const newSelected = new Date(currentYear, currentMonth, dayNumber);
    setSelectedDate(newSelected);
    const activeTime = customTime.trim() || timeString;
    applySelection(newSelected, activeTime);
  };

  const handleTimeSelect = (t: string) => {
    setTimeString(t);
    setCustomTime("");
    applySelection(selectedDate, t);
  };

  const handleCustomTimeSubmit = (val: string) => {
    setCustomTime(val);
    if (val.trim()) {
      applySelection(selectedDate, val.trim());
    }
  };

  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.triggerBox,
          {
            backgroundColor: colors.card,
            borderColor: isOpen ? primaryAccentColor : colors.border,
            borderWidth: colors.borderWidth,
          },
        ]}
        onPress={() => setIsOpen(!isOpen)}
        accessibilityLabel="Abrir calendário para escolher data e horário"
      >
        <CalendarIcon size={20} color={primaryAccentColor} />
        <Text style={[styles.triggerText, { color: colors.text, fontSize: Math.round(15 * fontScale) }]}>
          {value || "Selecione o Horário"}
        </Text>
        <View style={[styles.badge, { backgroundColor: isHighContrast ? "#222200" : "#E5EDFF" }]}>
          <Text style={[styles.badgeText, { color: primaryAccentColor }]}>
            {isOpen ? "FECHAR ▲" : "CALENDÁRIO ▼"}
          </Text>
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View
          style={[
            styles.calendarCard,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: primaryAccentColor,
              borderWidth: 2,
            },
          ]}
        >
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowBtn} accessibilityLabel="Mês anterior">
              <ChevronLeft size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.monthTitle, { color: colors.text, fontSize: Math.round(16 * fontScale) }]}>
              {getMonthName(currentYear, currentMonth)} {currentYear}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn} accessibilityLabel="Próximo mês">
              <ChevronRight size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekdaysRow}>
            {WEEKDAY_NAMES.map((w, idx) => (
              <View key={idx} style={styles.weekdayCell}>
                <Text style={[styles.weekdayText, { color: colors.textMuted }]}>{w}</Text>
              </View>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {calendarCells.map((dayNum, index) => {
              if (dayNum === null) {
                return <View key={`empty-${index}`} style={styles.dayCellEmpty} />;
              }

              const isSelected =
                selectedDate.getDate() === dayNum &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;

              const isTodayCell =
                today.getDate() === dayNum &&
                today.getMonth() === currentMonth &&
                today.getFullYear() === currentYear;

              return (
                <TouchableOpacity
                  key={`day-${dayNum}`}
                  style={[
                    styles.dayCell,
                    {
                      backgroundColor: isSelected
                        ? primaryAccentColor
                        : isTodayCell
                        ? colors.card
                        : colors.card,
                      borderColor: isSelected
                        ? primaryAccentColor
                        : isTodayCell
                        ? primaryAccentColor
                        : colors.border,
                      borderWidth: isSelected || isTodayCell ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleSelectDay(dayNum)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: isSelected ? colors.primaryContrast : colors.text,
                        fontWeight: isSelected || isTodayCell ? "700" : "500",
                      },
                    ]}
                  >
                    {dayNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.timeSectionHeader}>
            <Clock size={16} color={primaryAccentColor} />
            <Text style={[styles.timeSectionTitle, { color: colors.text, fontSize: Math.round(14 * fontScale) }]}>
              Horário do Lembrete
            </Text>
          </View>

          <View style={styles.timeChipsRow}>
            {TIME_PRESETS.map((t) => {
              const isTimeSelected = (customTime.trim() || timeString) === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: isTimeSelected ? primaryAccentColor : colors.card,
                      borderColor: isTimeSelected ? primaryAccentColor : colors.border,
                    },
                  ]}
                  onPress={() => handleTimeSelect(t)}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      { color: isTimeSelected ? colors.primaryContrast : colors.text },
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.customTimeRow}>
            <Text style={[styles.customTimeLabel, { color: colors.textMuted }]}>Ou digite (HH:MM):</Text>
            <TextInput
              style={[
                styles.customTimeInput,
                { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
              ]}
              value={customTime}
              onChangeText={handleCustomTimeSubmit}
              placeholder="Ex: 19:30"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <TouchableOpacity
            style={[styles.closeCalendarBtn, { backgroundColor: primaryAccentColor }]}
            onPress={() => setIsOpen(false)}
          >
            <Check size={18} color={colors.primaryContrast} />
            <Text style={[styles.closeCalendarBtnText, { color: colors.primaryContrast }]}>
              Confirmar Data e Horário
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 4,
  },
  triggerBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 56,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  triggerText: {
    fontWeight: "bold",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  calendarCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  arrowBtn: {
    padding: 6,
  },
  monthTitle: {
    fontWeight: "bold",
  },
  weekdaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  weekdayCell: {
    width: "14%",
    alignItems: "center",
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "600",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
  },
  dayCellEmpty: {
    width: "14%",
    height: 40,
  },
  dayCell: {
    width: "14%",
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 14,
  },
  timeSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    marginBottom: 8,
  },
  timeSectionTitle: {
    fontWeight: "bold",
  },
  timeChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  customTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 6,
  },
  customTimeLabel: {
    fontSize: 12,
  },
  customTimeInput: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  closeCalendarBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 46,
    borderRadius: 8,
    marginTop: 14,
  },
  closeCalendarBtnText: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
