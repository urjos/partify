import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { colors } from "@/constants/theme";
import { formatPeruPhone, getPeruPhoneValidationMessage } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export interface ContactMethodCardProps {
  contactMethod: "chat" | "external";
  onContactMethodChange: (method: "chat" | "external") => void;
  externalUrl: string;
  onExternalUrlChange: (url: string) => void;
  contactPhone: string;
  onContactPhoneChange: (phone: string) => void;
}

const getLinkValidationMessage = (rawUrl: string): string | null => {
  if (!rawUrl || rawUrl.trim() === "") return null;
  const clean = rawUrl.trim();

  const urlPattern =
    /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;

  if (!urlPattern.test(clean)) {
    return "Ingresa un enlace válido (ej. https://passline.com/evento/tu-evento).";
  }
  return null;
};

export default function ContactMethodCard({
  contactMethod,
  onContactMethodChange,
  externalUrl,
  onExternalUrlChange,
  contactPhone,
  onContactPhoneChange,
}: ContactMethodCardProps) {
  const phoneError = getPeruPhoneValidationMessage(contactPhone);
  const isPhoneValid =
    contactPhone.replace(/\D/g, "").length === 9 && !phoneError;

  const urlError = getLinkValidationMessage(externalUrl);
  const isUrlValid = externalUrl.trim().length > 0 && !urlError;

  const handlePhoneChange = (text: string) => {
    const formatted = formatPeruPhone(text);
    onContactPhoneChange(formatted);
  };

  const handleUrlChange = (text: string) => {
    const noSpaces = text.replace(/\s/g, "");
    onExternalUrlChange(noSpaces);
  };

  const phoneBorderClass = phoneError
    ? "border-delete"
    : isPhoneValid
      ? "border-success"
      : "border-border/40";

  const urlBorderClass = urlError
    ? "border-delete"
    : isUrlValid
      ? "border-success"
      : "border-border/40";

  return (
    <View className="gap-5">
      <Text className="text-xl font-bold text-primary">Medio de contacto</Text>

      <View className="rounded-2xl gap-6">
        {/* Opción 1: Chat directo (WhatsApp) */}
        <View className="flex gap-2">
          <Pressable
            onPress={() => onContactMethodChange("chat")}
            className="flex-row items-center active:opacity-80"
          >
            {/* Radio circle */}
            <View
              className={`size-5 rounded-full border-2 items-center justify-center mr-3 ${
                contactMethod === "chat"
                  ? "border-accent-pink"
                  : "border-border"
              }`}
            >
              {contactMethod === "chat" ? (
                <View className="size-2.5 rounded-full bg-accent-pink" />
              ) : null}
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-semibold text-primary">
                  Chat directo
                </Text>
              </View>
              <Text className="text-xs font-medium text-muted-foreground mt-1 leading-relaxed">
                Coordina transferencias o entrega de entradas directamente vía
                WhatsApp.
              </Text>
            </View>
          </Pressable>

          {/* Campo de Número de WhatsApp cuando se selecciona Chat directo */}
          {contactMethod === "chat" ? (
            <View className="pl-7 gap-1">
              <View
                className={`flex-row items-center bg-modal-background px-3.5 rounded-xl border ${phoneBorderClass}`}
              >
                <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
                <Text className="text-xs font-bold text-muted-foreground ml-1.5 mr-0.5">
                  +51
                </Text>
                <TextInput
                  className="flex-1 text-primary text-sm font-semibold py-2.5"
                  placeholder="987 654 321"
                  placeholderTextColor={colors.mutedForeground}
                  value={contactPhone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  maxLength={11}
                />
              </View>
              <FormErrorMessage message={phoneError} />
            </View>
          ) : null}
        </View>

        {/* Opción 2: Enlace de Ticketing externo */}
        <View className="flex gap-2">
          <Pressable
            onPress={() => onContactMethodChange("external")}
            className="flex-row items-center active:opacity-80"
          >
            {/* Radio circle */}
            <View
              className={`size-5 rounded-full border-2 items-center justify-center mr-3 ${
                contactMethod === "external"
                  ? "border-accent-pink"
                  : "border-border"
              }`}
            >
              {contactMethod === "external" ? (
                <View className="size-2.5 rounded-full bg-accent-pink" />
              ) : null}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-semibold text-primary">
                Enlace de Ticketing externo
              </Text>
              <Text className="text-xs font-medium text-muted-foreground mt-1 leading-relaxed">
                Redirige a plataformas como Passline, Eventbrite o Joinnus.
              </Text>
            </View>
          </Pressable>

          {/* Campo de URL cuando se selecciona Ticketing externo */}
          {contactMethod === "external" ? (
            <View className="pl-7 gap-1">
              <View
                className={`flex-row items-center bg-modal-background px-3.5 rounded-xl border ${urlBorderClass}`}
              >
                <Ionicons
                  name="link-outline"
                  size={18}
                  color={
                    urlError
                      ? colors.delete
                      : isUrlValid
                        ? colors.success
                        : colors.mutedForeground
                  }
                />
                <TextInput
                  className="flex-1 text-primary text-sm font-medium py-2.5 pl-2"
                  placeholder="https://passline.com/evento/tu-evento"
                  placeholderTextColor={colors.mutedForeground}
                  value={externalUrl}
                  onChangeText={handleUrlChange}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
              </View>
              <FormErrorMessage message={urlError} />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
