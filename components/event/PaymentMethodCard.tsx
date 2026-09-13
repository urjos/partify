import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface PaymentMethodCardProps {
  method: "chat" | "external";
  onMethodChange: (m: "chat" | "external") => void;
  externalUrl: string;
  onExternalUrlChange: (url: string) => void;
  contactPhone: string;
  onContactPhoneChange: (phone: string) => void;
}

export default function PaymentMethodCard({
  method,
  onMethodChange,
  externalUrl,
  onExternalUrlChange,
  contactPhone,
  onContactPhoneChange,
}: PaymentMethodCardProps) {
  return (
    <View className="gap-5">
      <Text className="text-xl font-bold text-primary">Medios de pago</Text>

      <View className=" rounded-2xl gap-6">
        {/* Opción 1: Chat directo (WhatsApp) */}
        <View className="flex gap-2">
          <Pressable
            onPress={() => onMethodChange("chat")}
            className="flex-row items-center active:opacity-80"
          >
            {/* Radio circle */}
            <View
              className={`size-5 rounded-full border-2 items-center justify-center mr-3 ${
                method === "chat" ? "border-accent-pink" : "border-border"
              }`}
            >
              {method === "chat" ? (
                <View className="size-2.5 rounded-full bg-accent-pink" />
              ) : null}
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-semibold text-primary">
                  Chat directo
                </Text>
              </View>
              <Text className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Coordina transferencias o entrega de entradas directamente vía
                WhatsApp.
              </Text>
            </View>
          </Pressable>

          {/* Campo de Número de WhatsApp cuando se selecciona Chat directo */}
          {method === "chat" ? (
            <View className="pl-7 gap-1">
              <View className="flex-row items-center bg-card px-3.5 rounded-l-lg gap-1">
                <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                <TextInput
                  className="flex-1 text-primary text-sm font-semibold"
                  placeholder="Ej. +51 987 654 321"
                  placeholderTextColor={colors.mutedForeground}
                  value={contactPhone}
                  onChangeText={onContactPhoneChange}
                  keyboardType="phone-pad"
                />
              </View>
              <Text className="text-xs text-muted-foreground">
                Al pulsar "Contactar", el interesado abrirá un chat directo
                contigo en WhatsApp.
              </Text>
            </View>
          ) : null}
        </View>

        {/* Opción 2: Enlace de Ticketing externo */}
        <View className="flex gap-2">
          <Pressable
            onPress={() => onMethodChange("external")}
            className="flex-row items-center active:opacity-80"
          >
            {/* Radio circle */}
            <View
              className={`size-5 rounded-full border-2 items-center justify-center mr-3 ${
                method === "external" ? "border-accent-pink" : "border-border"
              }`}
            >
              {method === "external" ? (
                <View className="size-2.5 rounded-full bg-accent-pink" />
              ) : null}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-semibold text-primary">
                Enlace de Ticketing externo
              </Text>
              <Text className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Redirige a plataformas como Passline, Eventbrite o Joinnus.
              </Text>
            </View>
          </Pressable>

          {/* Campo de URL cuando se selecciona Ticketing externo */}
          {method === "external" ? (
            <View className="pl-8 gap-1">
              <TextInput
                className="bg-card text-primary text-sm font-medium px-3.5 rounded-xl"
                placeholder="https://passline.com/evento/tu-evento"
                placeholderTextColor={colors.mutedForeground}
                value={externalUrl}
                onChangeText={onExternalUrlChange}
                autoCapitalize="none"
                keyboardType="url"
                style={{ paddingLeft: 8 }}
              />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
