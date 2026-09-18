import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import React from "react";
import { Image, Text, View } from "react-native";

interface ProfileStatsProps {
  rating?: number;
  attendedCount?: number;
  organizedCount?: number;
  onEditPress?: () => void;
}

export default function ProfileStats({
  rating = 5.0,
  attendedCount = 0,
  organizedCount = 0,
  onEditPress,
}: ProfileStatsProps) {
  return (
    <View className="gap-5">
      {/* Fila de 3 tarjetas de estadísticas */}
      <View className="flex-row gap-3">
        {/* Puntuación */}
        <View className="flex-1 bg-modal-background rounded-2xl py-2.5 px-2 items-center justify-center border-none">
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-bold text-primary">
              {rating.toFixed(1)}
            </Text>
            <Image
              source={icons.star}
              className="size-3"
              tintColor={colors.accentPink}
            />
          </View>
          <Text
            numberOfLines={1}
            className="text-xs font-medium text-muted-foreground mt-1 text-center"
          >
            Puntuación
          </Text>
        </View>

        {/* Fiestas vividas */}
        <View className="flex-1 bg-modal-background rounded-2xl py-2.5 px-2 items-center justify-center border-none">
          <Text className="text-lg font-bold text-primary">
            {attendedCount}
          </Text>
          <Text
            numberOfLines={1}
            className="text-xs font-medium text-muted-foreground mt-1 text-center"
          >
            Vividas
          </Text>
        </View>

        {/* Fiestas organizadas */}
        <View className="flex-1 bg-modal-background rounded-2xl py-2.5 px-2 items-center justify-center border-none">
          <Text className="text-lg font-bold text-primary">
            {organizedCount}
          </Text>
          <Text
            numberOfLines={1}
            className="text-xs font-medium text-muted-foreground mt-1 text-center"
          >
            Organizadas
          </Text>
        </View>
      </View>
    </View>
  );
}
