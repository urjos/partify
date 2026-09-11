import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { ChevronDown, Clock } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Modal, Platform, Pressable, Text, View } from "react-native";

dayjs.locale("es");

export interface ScheduleValue {
  date: Date;
  startTime: string; // Formato 12h: "8:00 PM"
  endTime: string; // Formato 12h: "2:30 AM"
}

export interface SchedulePickerProps {
  label?: string;
  value: ScheduleValue;
  onChange: (newValue: ScheduleValue) => void;
}

// Convierte Date a string de 12 horas con AM/PM (ej. "8:00 PM")
export const formatTime12h = (d: Date): string => {
  return dayjs(d).format("h:mm A");
};

// Parsea un string "h:mm A" junto con una fecha base a un objeto Date
export const parseTimeToDate = (timeStr: string, baseDate: Date): Date => {
  const result = new Date(baseDate);
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return result;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  result.setHours(hours, minutes, 0, 0);
  return result;
};

// Capitaliza la primera letra (ej. "sáb 14 oct" -> "Sáb 14 Oct")
const formatDisplayDate = (d: Date): string => {
  const raw = dayjs(d).locale("es").format("ddd D MMM");
  return raw
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function SchedulePicker({
  label = "Horario",
  value,
  onChange,
}: SchedulePickerProps) {
  // Estados para selectores nativos
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  // Estados temporales para el modal de horario
  const [tempStartTime, setTempStartTime] = useState<Date>(() =>
    parseTimeToDate(value.startTime, value.date),
  );
  const [tempEndTime, setTempEndTime] = useState<Date>(() =>
    parseTimeToDate(value.endTime, value.date),
  );
  const [activeTimeField, setActiveTimeField] = useState<
    "start" | "end" | null
  >(null);
  const [timeError, setTimeError] = useState<string | null>(null);

  const isToday = dayjs(value.date).isSame(dayjs(), "day");

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowDatePicker(Platform.OS === "ios");
    if (event.type === "set" && selectedDate) {
      const now = new Date();
      // Si la fecha seleccionada es hoy, asegurar que la hora de inicio no haya quedado en el pasado
      let nextStartTime = value.startTime;
      if (dayjs(selectedDate).isSame(dayjs(now), "day")) {
        const currentDateStart = parseTimeToDate(value.startTime, selectedDate);
        if (currentDateStart.getTime() < now.getTime()) {
          // Ajustar automáticamente a la hora actual
          nextStartTime = formatTime12h(now);
        }
      }

      onChange({
        ...value,
        date: selectedDate,
        startTime: nextStartTime,
      });
    }
  };

  const handleOpenTimeModal = () => {
    let startD = parseTimeToDate(value.startTime, value.date);
    let endD = parseTimeToDate(value.endTime, value.date);
    const now = new Date();

    // Si la fecha es hoy y startD quedó en el pasado, sincronizar a la hora actual
    if (dayjs(value.date).isSame(dayjs(now), "day")) {
      if (startD.getTime() < now.getTime()) {
        startD = new Date(now);
      }
    }

    // Si la hora de fin es menor o igual en minutos a la de inicio (ej. 2:30 AM vs 8:00 PM),
    // es un evento nocturno que finaliza al día siguiente (+1 día)
    const startMin = startD.getHours() * 60 + startD.getMinutes();
    const endMin = endD.getHours() * 60 + endD.getMinutes();
    if (endMin <= startMin) {
      endD.setDate(startD.getDate() + 1);
    } else {
      endD.setDate(startD.getDate());
    }

    setTempStartTime(startD);
    setTempEndTime(endD);
    setTimeError(null);
    setShowTimeModal(true);
  };

  // Manejador de selección de hora (inicio o fin)
  const handleNativeTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    const field = activeTimeField;
    setActiveTimeField(null);

    if (event.type === "set" && selectedTime) {
      const now = new Date();

      if (field === "start") {
        const newStart = new Date(value.date);
        newStart.setHours(
          selectedTime.getHours(),
          selectedTime.getMinutes(),
          0,
          0,
        );

        if (isToday) {
          // Si es hoy, no permitir una hora pasada (margen de 1 minuto)
          if (newStart.getTime() < now.getTime() - 60000) {
            setTimeError("La hora de inicio no puede ser anterior a la actual");
            setTempStartTime(now);
            return;
          }
        }

        setTimeError(null);
        setTempStartTime(newStart);

        // Mantener la fecha de tempEndTime correcta si cruza medianoche
        const startMin = newStart.getHours() * 60 + newStart.getMinutes();
        const endMin = tempEndTime.getHours() * 60 + tempEndTime.getMinutes();
        const newEnd = new Date(value.date);
        newEnd.setHours(tempEndTime.getHours(), tempEndTime.getMinutes(), 0, 0);
        if (endMin <= startMin) {
          newEnd.setDate(newEnd.getDate() + 1);
        }
        setTempEndTime(newEnd);
      } else if (field === "end") {
        const newEnd = new Date(value.date);
        newEnd.setHours(
          selectedTime.getHours(),
          selectedTime.getMinutes(),
          0,
          0,
        );

        const startMin =
          tempStartTime.getHours() * 60 + tempStartTime.getMinutes();
        const endMin = selectedTime.getHours() * 60 + selectedTime.getMinutes();

        // Si la hora de fin es menor o igual en minutos que la hora de inicio,
        // pertenece al día siguiente (+1 día)
        if (endMin <= startMin) {
          newEnd.setDate(newEnd.getDate() + 1);
        }

        setTimeError(null);
        setTempEndTime(newEnd);
      }
    }
  };

  // Confirmar horario desde el modal
  const handleConfirmTime = () => {
    const now = new Date();
    if (isToday) {
      const checkStart = new Date(value.date);
      checkStart.setHours(
        tempStartTime.getHours(),
        tempStartTime.getMinutes(),
        0,
        0,
      );
      // Margen de 1 minuto por si estuvo abierto el modal mientras pasaba el minuto
      if (checkStart.getTime() < now.getTime() - 60000) {
        setTimeError(
          "La hora de inicio no puede ser anterior a la hora actual",
        );
        return;
      }
    }

    setTimeError(null);
    onChange({
      ...value,
      startTime: formatTime12h(tempStartTime),
      endTime: formatTime12h(tempEndTime),
    });
    setShowTimeModal(false);
  };

  // Determinar si el rango cruza medianoche (evento nocturno "+1 día")
  const isOvernight = (() => {
    const startMinutes =
      tempStartTime.getHours() * 60 + tempStartTime.getMinutes();
    const endMinutes = tempEndTime.getHours() * 60 + tempEndTime.getMinutes();
    return endMinutes <= startMinutes;
  })();

  return (
    <View className="py-2">
      <View className="flex-row items-center justify-between">
        {/* Lado izquierdo: Ícono de reloj y título "Horario" */}
        <View className="flex-row items-center">
          <Clock size={18} color={colors.primary} />
          <Text className="text-primary font-bold text-base ml-2.5">
            {label}
          </Text>
        </View>

        {/* Lado derecho: Píldoras de Fecha y Horario */}
        <View className="flex-row items-center gap-2">
          {/* Píldora 1: Fecha (ej. "Sáb 14 Oct ⌵") */}
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center px-3.5 py-1.5 bg-card rounded-full border-none active:opacity-75"
          >
            <Text className="text-primary text-sm font-medium">
              {formatDisplayDate(value.date)}
            </Text>
            <ChevronDown
              size={14}
              color={colors.mutedForeground}
              className="ml-1"
            />
          </Pressable>

          {/* Píldora 2: Rango de Horario (ej. "8:00 PM - 2:30 AM") */}
          <Pressable
            onPress={handleOpenTimeModal}
            className="flex-row items-center px-3.5 py-1.5 bg-card rounded-full border-none active:opacity-75"
          >
            <Text className="text-primary text-sm font-medium">
              {value.startTime} - {value.endTime}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Selector nativo de Fecha */}
      {showDatePicker && (
        <DateTimePicker
          value={value.date}
          mode="date"
          display="default"
          minimumDate={dayjs().startOf("day").toDate()}
          onChange={handleDateChange}
        />
      )}

      {/* Modal para configurar Hora de Inicio y Hora de Fin */}
      <Modal
        visible={showTimeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <Pressable
          onPress={() => setShowTimeModal(false)}
          className="flex-1 bg-black/50 items-center justify-center p-4"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-modal-background border-none rounded-2xl p-5"
          >
            <View className="py-4 gap-3">
              {/* Campo Hora de Inicio */}
              <View className="flex-row items-center justify-between bg-card rounded-xl p-3 border-none">
                <View>
                  <Text className="text-muted-foreground text-xs font-medium">
                    Hora de inicio
                  </Text>
                  <Text className="text-primary text-lg font-semibold mt-0.5">
                    {formatTime12h(tempStartTime)}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setActiveTimeField("start")}
                  className="px-3 py-1.5 rounded-lg border-none"
                >
                  <Text className="text-muted-foreground text-xs font-semibold">
                    Cambiar
                  </Text>
                </Pressable>
              </View>

              {/* Campo Hora de Fin */}
              <View className="flex-row items-center justify-between bg-card rounded-xl p-3 border-none">
                <View>
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-muted-foreground text-xs font-medium">
                      Hora de fin
                    </Text>
                    {isOvernight && (
                      <Text className="text-accent-pink text-[10px] font-semibold bg-accent-pink/10 px-1.5 py-0.5 rounded">
                        +1 día
                      </Text>
                    )}
                  </View>
                  <Text className="text-primary text-lg font-semibold mt-0.5">
                    {formatTime12h(tempEndTime)}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setActiveTimeField("end")}
                  className="px-3 py-1.5 rounded-lg border-none"
                >
                  <Text className="text-muted-foreground text-xs font-semibold">
                    Cambiar
                  </Text>
                </Pressable>
              </View>

              {/* Mensaje de error si la hora es anterior a la actual */}
              {timeError && (
                <Text className="text-destructive text-xs font-medium px-1">
                  {timeError}
                </Text>
              )}
            </View>

            {/* Botón de Confirmación */}
            <Pressable
              onPress={handleConfirmTime}
              className="w-full bg-accent-pink py-3 rounded-xl items-center justify-center mt-2 active:opacity-85"
            >
              <Text className="text-white font-semibold text-sm">
                Confirmar
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Selector nativo de Hora (Inicio / Fin) */}
      {activeTimeField !== null && (
        <DateTimePicker
          value={activeTimeField === "start" ? tempStartTime : tempEndTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleNativeTimeChange}
        />
      )}
    </View>
  );
}
