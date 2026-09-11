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
    <View className="mt-5">
      <Text className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-3">
        Medios de Pago y Coordinación
      </Text>

      <View className="bg-card rounded-2xl p-4 border border-border gap-4">
        {/* Opción 1: Chat directo (WhatsApp) */}
        <View>
          <Pressable
            onPress={() => onMethodChange("chat")}
            className="flex-row items-start active:opacity-80"
          >
            {/* Radio circle */}
            <View className="size-5 rounded-full border-2 border-accent-pink items-center justify-center mr-3 mt-0.5">
              {method === "chat" ? (
                <View className="size-2.5 rounded-full bg-accent-pink" />
              ) : null}
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-semibold text-primary">
                  Chat directo (WhatsApp)
                </Text>
                <View className="bg-accent-pink/20 px-2 py-0.5 rounded-full">
                  <Text className="text-[10px] font-bold text-accent-pink uppercase">
                    Rápido
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Coordina transferencias (Yape, Plin) o entrega de entradas
                directamente con los fiesteros vía WhatsApp.
              </Text>
            </View>
          </Pressable>

          {/* Campo de Número de WhatsApp cuando se selecciona Chat directo */}
          {method === "chat" ? (
            <View className="mt-3 pt-3 border-t border-border/50">
              <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                Número de celular (WhatsApp)
              </Text>
              <View className="flex-row items-center bg-modal-background px-3.5 py-2.5 rounded-xl border border-border">
                <Ionicons
                  name="logo-whatsapp"
                  size={18}
                  color="#25D366"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  className="flex-1 text-primary text-sm font-semibold p-0"
                  placeholder="Ej. +51 987 654 321 o 987654321"
                  placeholderTextColor={colors.mutedForeground}
                  value={contactPhone}
                  onChangeText={onContactPhoneChange}
                  keyboardType="phone-pad"
                />
              </View>
              <Text className="text-[11px] text-muted-foreground mt-1.5">
                Al pulsar "Contactar", el interesado abrirá un chat directo
                contigo en WhatsApp.
              </Text>
            </View>
          ) : null}
        </View>

        {/* Opción 2: Enlace de Ticketing externo */}
        <View className="pt-3 border-t border-border/50">
          <Pressable
            onPress={() => onMethodChange("external")}
            className="flex-row items-start active:opacity-80"
          >
            {/* Radio circle */}
            <View className="size-5 rounded-full border-2 border-border items-center justify-center mr-3 mt-0.5">
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
            <View className="mt-3 pt-3 border-t border-border/50">
              <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
                Enlace web del ticket
              </Text>
              <TextInput
                className="bg-modal-background text-primary text-xs font-medium px-3.5 py-3 rounded-xl border border-border"
                placeholder="https://passline.com/evento/tu-evento"
                placeholderTextColor={colors.mutedForeground}
                value={externalUrl}
                onChangeText={onExternalUrlChange}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
