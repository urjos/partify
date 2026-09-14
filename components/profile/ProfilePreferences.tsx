import AnimatedToggle from "@/components/shared/AnimatedToggle";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface ProfilePreferencesProps {
  notificationsEnabled: boolean;
  onToggleNotifications: (enabled: boolean) => void;
  appVersion?: string;
  onSignOut: () => void;
}

export default function ProfilePreferences({
  notificationsEnabled,
  onToggleNotifications,
  appVersion = "Partify v1.1.0",
  onSignOut,
}: ProfilePreferencesProps) {
  return (
    <View className="gap-4 mt-8">
      {/* Card de Notificaciones */}
      <View className="rounded-2xl border border-border/30 flex-row items-center justify-between gap-4">
        <View className="flex-1 pr-2">
          <Text className="text-sm font-sans-semibold text-primary">
            Recibir notificaciones
          </Text>
          <Text className="text-xs font-sans-medium text-muted-foreground mt-0.5 leading-snug">
            Alertas inmediatas de fiestas cercanas a ti.
          </Text>
        </View>

        <AnimatedToggle
          value={notificationsEnabled}
          onValueChange={onToggleNotifications}
        />
      </View>

      {/* Footer con versión y acción de cerrar sesión */}
      <View className="flex-row items-center justify-between mt-4 px-1 pb-8">
        <Text className="text-xs font-sans-medium text-muted-foreground">
          {appVersion}
        </Text>

        <Pressable
          onPress={onSignOut}
          hitSlop={8}
          className="active:opacity-75"
        >
          <Text className="text-xs font-sans-semibold text-muted-foreground">
            Cerrar Sesión
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
