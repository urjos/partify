import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import React from "react";
import { Image, Text, View } from "react-native";

interface EventNightDetailsCardProps {
  description: string;
  corkageFree?: boolean;
  openBar?: boolean;
  dressCode?: string;
  dressCodeDetails?: string;
  isAdultsOnly?: boolean;
  requirePhysicalId?: boolean;
  contactMethod?: "chat" | "external";
  externalTicketUrl?: string;
}

export default function EventNightDetailsCard({
  description,
  corkageFree,
  openBar,
  dressCode,
  dressCodeDetails,
  isAdultsOnly,
  requirePhysicalId,
  contactMethod,
  externalTicketUrl,
}: EventNightDetailsCardProps) {
  // 1. Beneficio Bebidas
  let drinkTitle = "Bebidas";
  let drinkDesc = "Consumo en barra disponible.";
  if (corkageFree && openBar) {
    drinkTitle = "Corcho y Barra Libre";
    drinkDesc = "Tragos incluidos y puedes traer tus bebidas.";
  } else if (corkageFree) {
    drinkTitle = "Corcho libre";
    drinkDesc = "Puedes traer tu propio trago en este evento.";
  } else if (openBar) {
    drinkTitle = "Barra libre";
    drinkDesc = "Bebidas y tragos incluidos con el acceso.";
  }

  // 2. Dress Code
  const dressTitle = "Dress Code";
  const dressDesc =
    dressCodeDetails && dressCodeDetails.trim().length > 0
      ? `${dressCode || "Casual"} (${dressCodeDetails})`
      : dressCode || "Casual / Nocturno";

  // 3. Seguridad & Filtro
  let securityDesc = "Ingreso para todo público.";
  if (isAdultsOnly && requirePhysicalId) {
    securityDesc = "Mayores de 18 años con DNI físico obligatorio.";
  } else if (isAdultsOnly) {
    securityDesc = "Ingreso estrictamente para mayores de 18 años.";
  } else if (requirePhysicalId) {
    securityDesc = "Presentar DNI físico obligatorio en puerta.";
  }

  // 4. Métodos de Pago
  let paymentDesc = "Coordinación directa vía WhatsApp (Yape/Plin).";
  if (contactMethod === "external" && externalTicketUrl) {
    paymentDesc = "Venta oficial mediante plataforma de tickets (Passline).";
  }

  return (
    <View className="bg-modal-background rounded-3xl p-5 gap-4">
      <Text className="text-lg font-bold text-primary">Detalles</Text>

      {/* Descripción principal */}
      {description ? (
        <Text className="text-sm text-muted-foreground font-regular">
          {description}
        </Text>
      ) : null}

      {/* Grid 2x2 de Reglas y Beneficios */}
      <View className="gap-3 mt-1">
        {/* Fila 1 */}
        <View className="flex-row gap-3">
          {/* Card Bebidas / Corcho libre */}
          <View className="flex-1 border border-border rounded-2xl p-3.5 gap-2">
            <View className="flex-row items-center gap-2">
              <Image
                source={icons.martini}
                className="size-5"
                tintColor={colors.accent}
              />
              <Text
                className="text-sm font-bold text-primary flex-1"
                numberOfLines={1}
              >
                {drinkTitle}
              </Text>
            </View>
            <Text className="text-xs font-regular text-muted-foreground leading-relaxed">
              {drinkDesc}
            </Text>
          </View>

          {/* Card Dress Code */}
          <View className="flex-1 border border-border rounded-2xl p-3.5 gap-2">
            <View className="flex-row items-center gap-2">
              <Image
                source={icons.clothes}
                className="size-5"
                tintColor={colors.accent}
              />
              <Text
                className="text-sm font-bold text-primary flex-1"
                numberOfLines={1}
              >
                {dressTitle}
              </Text>
            </View>
            <Text className="text-xs font-regular text-muted-foreground leading-relaxed">
              {dressDesc}
            </Text>
          </View>
        </View>

        {/* Fila 2 */}
        <View className="flex-row gap-3">
          {/* Card Seguridad & Filtro */}
          <View className="flex-1 border border-border rounded-2xl p-3.5 gap-2">
            <View className="flex-row items-center gap-2">
              <Image
                source={icons.shield}
                className="size-5"
                tintColor={colors.accent}
              />
              <Text
                className="text-sm font-bold text-primary flex-1"
                numberOfLines={1}
              >
                Seguridad
              </Text>
            </View>
            <Text className="text-xs font-regular text-muted-foreground leading-relaxed">
              {securityDesc}
            </Text>
          </View>

          {/* Card Métodos de Pago */}
          <View className="flex-1 border border-border rounded-2xl p-3.5 gap-2">
            <View className="flex-row items-center gap-2">
              <Image
                source={icons.paymentMethod}
                className="size-5"
                tintColor={colors.accent}
              />
              <Text
                className="text-sm font-bold text-primary flex-1"
                numberOfLines={1}
              >
                Medio de Pago
              </Text>
            </View>
            <Text className="text-xs font-regular text-muted-foreground leading-relaxed">
              {paymentDesc}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
