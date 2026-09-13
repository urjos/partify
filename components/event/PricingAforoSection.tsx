import AnimatedToggle from "@/components/AnimatedToggle";
import PriceInput from "@/components/shared/PriceInput";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface PricingAforoSectionProps {
  isFree: boolean;
  onIsFreeChange: (isFree: boolean) => void;
  isMultiplePrices: boolean;
  onIsMultiplePricesChange: (multiple: boolean) => void;
  priceMen: string;
  onPriceMenChange: (val: string) => void;
  priceWomen: string;
  onPriceWomenChange: (val: string) => void;
  capacity: number;
  onCapacityChange: (cap: number) => void;
}

export default function PricingAforoSection({
  isFree,
  onIsFreeChange,
  isMultiplePrices,
  onIsMultiplePricesChange,
  priceMen,
  onPriceMenChange,
  priceWomen,
  onPriceWomenChange,
  capacity,
  onCapacityChange,
}: PricingAforoSectionProps) {
  return (
    <View className="gap-5">
      <Text className="text-xl font-bold text-primary">Aforo y aportación</Text>

      <View className="rounded-2xl border-none gap-6">
        {/* Toggle 1: ¿Evento gratuito? */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1 pr-4">
            <Text className="text-sm font-semibold text-primary">
              ¿Evento gratuito?
            </Text>
            <Text className="text-xs text-muted-foreground mt-0.5">
              Entrada libre sin costo de acceso
            </Text>
          </View>
          <AnimatedToggle value={isFree} onValueChange={onIsFreeChange} />
        </View>

        {/* Si el evento no es gratuito: se muestran opciones de precios */}
        {!isFree && (
          <>
            {/* Toggle 2: ¿Evento con múltiples precios? */}
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-primary">
                  ¿Evento con múltiples precios?
                </Text>
                <Text className="text-xs text-muted-foreground mt-0.5">
                  El precio de entrada puede variar según el usuario
                </Text>
              </View>
              <AnimatedToggle
                value={isMultiplePrices}
                onValueChange={onIsMultiplePricesChange}
              />
            </View>
            <View className="p-3 gap-4 rounded-2xl border border-card">
              {!isMultiplePrices && (
                <>
                  {/* Dos campos: Hombre y Mujer */}
                  <View className="flex-row gap-3">
                    {/* Precio Hombre */}
                    <View className="flex-1 gap-2">
                      <Text className="text-xs font-medium text-muted-foreground">
                        Hombre
                      </Text>
                      <PriceInput
                        value={priceMen}
                        onChange={onPriceMenChange}
                      />
                    </View>

                    {/* Precio Mujer */}
                    <View className="flex-1 gap-2">
                      <Text className="text-xs font-medium text-muted-foreground">
                        Mujer
                      </Text>
                      <PriceInput
                        value={priceWomen}
                        onChange={onPriceWomenChange}
                      />
                    </View>
                  </View>
                </>
              )}
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-sm font-semibold text-primary">
                    Capacidad Máxima
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-0.5">
                    Evita sobrecupos inesperados
                  </Text>
                </View>

                <View className="flex-row items-center bg-modal-background rounded-xl border border-card overflow-hidden">
                  <Pressable
                    onPress={() =>
                      onCapacityChange(Math.max(1, (capacity || 0) - 5))
                    }
                    className="p-2.5 items-center justify-center active:bg-muted"
                  >
                    <Ionicons name="remove" size={16} color={colors.primary} />
                  </Pressable>
                  <TextInput
                    className="text-primary font-bold text-sm px-2 p-0"
                    style={{ textAlign: "center", minWidth: 48 }}
                    value={capacity === 0 ? "" : String(capacity)}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/[^0-9]/g, "");
                      onCapacityChange(
                        cleaned === "" ? 0 : parseInt(cleaned, 10),
                      );
                    }}
                    onBlur={() => {
                      if (!capacity || capacity < 1) {
                        onCapacityChange(1);
                      }
                    }}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={colors.mutedForeground}
                    selectTextOnFocus
                  />
                  <Pressable
                    onPress={() => onCapacityChange((capacity || 0) + 5)}
                    className="p-2.5 items-center justify-center active:bg-muted"
                  >
                    <Ionicons name="add" size={16} color={colors.primary} />
                  </Pressable>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Capacidad Máxima con Stepper */}
      </View>
    </View>
  );
}
