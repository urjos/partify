import AnimatedToggle from "@/components/shared/AnimatedToggle";
import CategoryChips from "@/components/shared/CategoryChips";
import PriceInput from "@/components/shared/PriceInput";
import SchedulePicker, {
  formatTime12h,
} from "@/components/shared/SchedulePicker";
import { EVENT_CATEGORIES } from "@/constants/categories";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import Slider from "@react-native-community/slider";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export interface SearchFilters {
  enableDistance: boolean;
  distance: number;
  category: string | null;
  date: Date;
  startTime: string;
  endTime: string;
  priceMin: string;
  priceMax: string;
  instantConfirm: boolean;
  openBar: boolean;
  corkageFree: boolean;
}

export const getDefaultFilters = (): SearchFilters => {
  const now = new Date();
  const start = new Date(now);

  if (now.getHours() >= 20) {
    const minutes = now.getMinutes();
    if (minutes < 30) {
      start.setMinutes(30, 0, 0);
    } else {
      start.setHours(start.getHours() + 1, 0, 0, 0);
    }
  } else {
    start.setHours(20, 0, 0, 0);
  }

  const end = new Date(start);
  if (now.getHours() >= 22) {
    end.setHours(start.getHours() + 5, 0, 0, 0);
  } else {
    end.setDate(end.getDate() + 1);
    end.setHours(2, 30, 0, 0);
  }

  return {
    enableDistance: false,
    distance: 1,
    category: null,
    date: now,
    startTime: formatTime12h(start),
    endTime: formatTime12h(end),
    priceMin: "0",
    priceMax: "0",
    instantConfirm: false,
    openBar: false,
    corkageFree: false,
  };
};

export const DEFAULT_FILTERS: SearchFilters = getDefaultFilters();

interface SearchFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export default function SearchFilterModal({
  visible,
  onClose,
  onApply,
  initialFilters,
}: SearchFilterModalProps) {
  const [filters, setFilters] = useState<SearchFilters>(
    initialFilters ?? getDefaultFilters(),
  );

  useEffect(() => {
    if (visible) {
      setFilters(initialFilters ?? getDefaultFilters());
    }
  }, [visible, initialFilters]);

  const handleClose = () => onClose();

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => setFilters(getDefaultFilters());

  const set = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => setFilters((prev) => ({ ...prev, [key]: value }));

  const isPriceError = (() => {
    const min = parseFloat(filters.priceMin || "0");
    const max = parseFloat(filters.priceMax || "0");
    if (min === 0 && max === 0) return false;
    return max < min;
  })();

  const isDateChanged =
    !dayjs(filters.date).isSame(dayjs(), "day") ||
    filters.startTime !== DEFAULT_FILTERS.startTime ||
    filters.endTime !== DEFAULT_FILTERS.endTime;

  const hasActiveFilters =
    filters.enableDistance ||
    filters.category !== null ||
    isDateChanged ||
    (filters.priceMin !== "" && filters.priceMin !== "0") ||
    (filters.priceMax !== "" && filters.priceMax !== "0") ||
    filters.instantConfirm ||
    filters.openBar ||
    filters.corkageFree;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        {/* Backdrop — absolutamente posicionado, no interfiere con el ScrollView */}
        <Pressable
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: colors.BackgroundModal },
          ]}
          onPress={handleClose}
        />

        {/* Card del modal — sin TouchableWithoutFeedback envolviéndolo */}
        <View className="sf-modal-container">
          {/* Handle */}
          <View className="items-center pb-4">
            <View className="w-12 h-1.5 rounded-full bg-primary/30" />
          </View>

          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center gap-2.5">
              <Image
                source={icons.filter}
                className="size-5"
                tintColor={colors.primary}
                resizeMode="contain"
              />
              <Text className="text-xl font-bold text-primary">Filtros</Text>
            </View>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Image
                source={icons.x}
                className="size-5"
                tintColor={colors.mutedForeground}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          <ScrollView
            className="sf-modal-scroll"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Radio de distancia */}
            <View className="sf-modal-section">
              <View className="flex-row items-center justify-between py-3.5">
                <View className="flex-1 pr-4">
                  <Text className="text-sm font-semibold text-primary">
                    Radio de distancia
                  </Text>
                  <Text className="text-xs font-medium text-muted-foreground mt-0.5">
                    Ajusta la distancia maxima que estas dispuesto a viajar
                  </Text>
                </View>
                <AnimatedToggle
                  value={filters.enableDistance}
                  onValueChange={(v) => {
                    setFilters((prev) => ({
                      ...prev,
                      enableDistance: v,
                      distance: v ? (prev.distance || 1) : prev.distance,
                    }));
                  }}
                />
              </View>

              {filters.enableDistance && (
                <>
                  <View className="flex-row items-center justify-end mb-2">
                    <View className="px-3 py-1.5 rounded-full border-none bg-modal-background">
                      <Text className="text-sm font-bold text-primary">
                        {filters.distance} km
                      </Text>
                    </View>
                  </View>
                  <View className="px-1">
                    <Slider
                      style={{ width: "100%", height: 40 }}
                      minimumValue={1}
                      maximumValue={50}
                      step={1}
                      value={filters.distance}
                      onValueChange={(v) => set("distance", v)}
                      minimumTrackTintColor={colors.accentPink}
                      maximumTrackTintColor={colors.card}
                      thumbTintColor={colors.accentPink}
                    />

                    <View className="flex-row items-center justify-between px-2 mt-1">
                      <Text className="text-xs font-medium text-muted-foreground">
                        1 km
                      </Text>
                      <Text className="text-xs font-medium text-muted-foreground">
                        25 km
                      </Text>
                      <Text className="text-xs font-medium text-muted-foreground">
                        50 km
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Tipo de Fiesta */}
            <View className="sf-modal-section">
              <Text className="sf-modal-section-title">Tipo de fiesta</Text>
              <CategoryChips
                items={EVENT_CATEGORIES}
                selected={filters.category}
                onSelect={(v) => set("category", v)}
              />
            </View>

            {/* Rango de Precio */}
            <View className="sf-modal-section">
              <Text className="sf-modal-section-title">Rango de precio</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-xs font-medium text-muted-foreground mb-1.5">
                    Mínimo
                  </Text>
                  <PriceInput
                    value={filters.priceMin}
                    onChange={(v) => set("priceMin", v)}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-medium text-muted-foreground mb-1.5">
                    Máximo
                  </Text>
                  <PriceInput
                    value={filters.priceMax}
                    onChange={(v) => set("priceMax", v)}
                  />
                </View>
              </View>
              {isPriceError && (
                <Text className="text-xs font-medium text-destructive mt-3 text-center">
                  El máximo debe ser mayor o igual al mínimo
                </Text>
              )}
            </View>

            {/* Horario & Dia */}
            <View className="sf-modal-section">
              <SchedulePicker
                value={{
                  date: filters.date,
                  startTime: filters.startTime,
                  endTime: filters.endTime,
                }}
                onChange={({ date, startTime, endTime }) => {
                  setFilters((prev) => ({
                    ...prev,
                    date,
                    startTime,
                    endTime,
                  }));
                }}
              />
            </View>

            {/* Otros */}
            <View className="sf-modal-section">
              <Text className="sf-modal-section-title">Otros</Text>

              <View className="flex-row items-center justify-between py-3.5">
                <View className="flex-1 pr-4">
                  <Text className="text-sm font-semibold text-primary">
                    Confirmacion instantanea
                  </Text>
                  <Text className="text-xs font-medium text-muted-foreground mt-0.5">
                    Sin esperar aprobacion del anfitron
                  </Text>
                </View>
                <AnimatedToggle
                  value={filters.instantConfirm}
                  onValueChange={(v) => set("instantConfirm", v)}
                />
              </View>

              <View className="flex-row items-center justify-between py-3.5 ">
                <View className="flex-1 pr-4">
                  <Text className="text-sm font-semibold text-primary">
                    Barra Libre
                  </Text>
                  <Text className="text-xs font-medium text-muted-foreground mt-0.5">
                    Tiene trago dentro de la fiesta
                  </Text>
                </View>
                <AnimatedToggle
                  value={filters.openBar}
                  onValueChange={(v) => set("openBar", v)}
                />
              </View>

              <View className="flex-row items-center justify-between py-3.5">
                <View className="flex-1 pr-4">
                  <Text className="text-sm font-semibold text-primary">
                    Corcho libre
                  </Text>
                  <Text className="text-xs font-medium text-muted-foreground mt-0.5">
                    Puedes llevar tu propio trago
                  </Text>
                </View>
                <AnimatedToggle
                  value={filters.corkageFree}
                  onValueChange={(v) => set("corkageFree", v)}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="flex-row gap-3 pt-3">
            <Pressable
              onPress={handleReset}
              className="flex-1 items-center justify-center py-4 rounded-2xl bg-modal-background"
            >
              <Text className="text-sm font-bold text-primary">
                Restablecer
              </Text>
            </Pressable>

            <Pressable
              onPress={handleApply}
              disabled={isPriceError}
              style={{ opacity: isPriceError ? 0.5 : 1 }}
              className="flex-1 items-center justify-center py-4 rounded-2xl bg-chip-background"
            >
              <Text className="text-sm font-bold text-accent-pink">
                {hasActiveFilters ? "Aplicar filtros" : "Aplicar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
