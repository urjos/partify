import AnimatedToggle from "@/components/shared/AnimatedToggle";
import React from "react";
import { Text, View } from "react-native";

interface EditPrivacyCardProps {
  visibleInRadar: boolean;
  onVisibleInRadarChange: (val: boolean) => void;
}

export default function EditPrivacyCard({
  visibleInRadar,
  onVisibleInRadarChange,
}: EditPrivacyCardProps) {
  return (
    <View className="gap-2">
      <Text className="text-lg font-bold text-primary px-1">Privacidad</Text>

      <View className="bg-modal-background rounded-3xl p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-sm font-semibold text-primary">
              Visible en radar de fiestas
            </Text>
            <Text className="text-xs font-medium text-muted-foreground mt-1 leading-relaxed">
              Tus amigos en Partify podrán ver cuando asistas a eventos en Lima
            </Text>
          </View>

          <AnimatedToggle
            value={visibleInRadar}
            onValueChange={onVisibleInRadarChange}
          />
        </View>
      </View>
    </View>
  );
}
