import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

dayjs.locale("es");

interface DateTimeCardProps {
  date: Date;
  onDateChange: (d: Date) => void;
  startTime: Date;
  onStartTimeChange: (t: Date) => void;
  endTime: Date;
  onEndTimeChange: (t: Date) => void;
}

export const formatDisplayDateFull = (d: Date): string => {
  const formatted = dayjs(d).locale("es").format("dddd, D [de] MMMM");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export const formatDisplayTime = (d: Date): string => {
  return dayjs(d).format("hh:mm A");
};

export default function DateTimeCard({
  date,
  onDateChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
}: DateTimeCardProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeTimePicker, setActiveTimePicker] = useState<
    "start" | "end" | null
  >(null);

  const handleDateSelected = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowDatePicker(Platform.OS === "ios");
    if (event.type === "set" && selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const handleTimeSelected = (
    event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    const field = activeTimePicker;
    setActiveTimePicker(null);

    if (event.type === "set" && selectedTime) {
      if (field === "start") {
        onStartTimeChange(selectedTime);
      } else if (field === "end") {
        onEndTimeChange(selectedTime);
      }
    }
  };

  return (
    <View className="mt-5">
      <Text className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-3">
        Fecha y Horarios
      </Text>

      <View className="bg-card rounded-2xl p-4 border border-border gap-4">
        {/* Fila 1: Fecha */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-3">
            <View className="size-10 rounded-xl bg-accent-pink/15 items-center justify-center mr-3">
              <Ionicons name="calendar" size={20} color={colors.accentPink} />
            </View>
            <View className="flex-1">
              <Text className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Fecha
              </Text>
              <Text
                className="text-sm font-semibold text-primary mt-0.5"
                numberOfLines={1}
              >
                {formatDisplayDateFull(date)}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="px-3.5 py-1.5 bg-muted rounded-full border border-border active:opacity-75"
          >
            <Text className="text-xs font-semibold text-primary">Cambiar</Text>
          </Pressable>
        </View>

        {/* Fila 2: Inicio y Cierre (Dos Columnas) */}
        <View className="flex-row gap-3 pt-3 border-t border-border/50">
          {/* Columna Inicio */}
          <Pressable
            onPress={() => setActiveTimePicker("start")}
            className="flex-1 flex-row items-center bg-modal-background p-3 rounded-xl border border-border active:opacity-80"
          >
            <View className="size-9 rounded-full bg-accent-pink/15 items-center justify-center mr-2.5">
              <Ionicons name="time" size={18} color={colors.accentPink} />
            </View>
            <View>
              <Text className="text-[10px] font-semibold text-muted-foreground uppercase">
                Inicio
              </Text>
              <Text className="text-sm font-bold text-primary mt-0.5">
                {formatDisplayTime(startTime)}
              </Text>
            </View>
          </Pressable>

          {/* Columna Cierre */}
          <Pressable
            onPress={() => setActiveTimePicker("end")}
            className="flex-1 flex-row items-center bg-modal-background p-3 rounded-xl border border-border active:opacity-80"
          >
            <View className="size-9 rounded-full bg-muted items-center justify-center mr-2.5">
              <Ionicons
                name="moon-outline"
                size={18}
                color={colors.mutedForeground}
              />
            </View>
            <View>
              <Text className="text-[10px] font-semibold text-muted-foreground uppercase">
                Cierre
              </Text>
              <Text className="text-sm font-bold text-primary mt-0.5">
                {formatDisplayTime(endTime)}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* DatePicker nativo */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={dayjs().startOf("day").toDate()}
          onChange={handleDateSelected}
        />
      )}

      {/* TimePicker nativo */}
      {activeTimePicker !== null && (
        <DateTimePicker
          value={activeTimePicker === "start" ? startTime : endTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeSelected}
        />
      )}
    </View>
  );
}
