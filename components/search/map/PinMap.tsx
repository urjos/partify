import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import React from "react";
import { Image, View } from "react-native";

export default function PinMap() {
  return (
    <View
      className="absolute inset-0 items-center justify-center"
      pointerEvents="none"
    >
      <View className="size-8 rounded-full bg-card items-center justify-center shadow-lg border border-border/40">
        <Image
          source={icons.mapPin}
          className="size-4"
          tintColor={colors.destructive}
        />
      </View>
    </View>
  );
}
