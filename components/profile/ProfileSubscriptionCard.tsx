import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import { useBilling } from "@/hooks/use-billing";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

export default function ProfileSubscriptionCard() {
  const { isPro, openBillingPortal } = useBilling();
  const [opening, setOpening] = useState(false);

  const handleOpenBilling = async () => {
    try {
      setOpening(true);
      await openBillingPortal();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo abrir el portal de facturación. Inténtalo de nuevo.",
      );
    } finally {
      setOpening(false);
    }
  };

  return (
    <View className="bg-modal-background rounded-3xl p-5 relative overflow-hidden">
      {/* Resplandor sutil de fondo */}
      <View
        pointerEvents="none"
        className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-accent-pink/10 blur-2xl"
      />

      {/* Badge "Tu plan" */}
      <View className="self-start px-2.5 py-1 rounded-md bg-white/10 mb-2">
        <Text className="text-white text-xs font-bold">Tu plan</Text>
      </View>

      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="size-8 rounded-full items-center justify-center">
            <Image
              source={images.logoPartify}
              className="size-10"
              resizeMode="contain"
            />
          </View>
          <Text className="text-base font-extrabold text-primary">
            {isPro ? "Pro" : "Free"}
          </Text>
        </View>
      </View>

      <Text className="text-xs text-muted-foreground leading-relaxed mb-4 font-medium">
        {isPro
          ? "Tienes acceso a eventos ilimitados, insignia verificada e impulso semanal para tus fiestas."
          : "Disfruta de hasta 2 fiestas activas simultáneas o suscríbete a Pro para desbloquear eventos ilimitados y verificación."}
      </Text>

      <Pressable
        onPress={handleOpenBilling}
        disabled={opening}
        className="active:opacity-80 overflow-hidden rounded-2xl"
      >
        <View className="rounded-2xl p-3 bg-submodal-background">
          {opening ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <View className="flex-row items-center gap-1 justify-center">
                <Text className="text-white font-bold text-sm">
                  {isPro ? "Gestionar suscripción" : "Ver planes y suscribirse"}
                </Text>
                <Image
                  source={icons.externalLink}
                  className="size-3.5"
                  tintColor={colors.primary}
                  resizeMode="contain"
                />
              </View>
            </>
          )}
        </View>
      </Pressable>
    </View>
  );
}
