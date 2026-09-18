import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import React from "react";
import { Image, Pressable, View } from "react-native";

interface LocationButtonProps {
  onPress: () => void;
  className?: string;
}

export default function LocationButton({
  onPress,
  className,
}: LocationButtonProps) {
  return (
    <View className={className ?? "items-end"}>
      <Pressable
        onPress={onPress}
        className="size-12 items-center justify-center rounded-full bg-modal-background/90 shadow-lg active:opacity-75"
      >
        <Image
          source={icons.navigation}
          className="size-5"
          tintColor={colors.primary}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}
