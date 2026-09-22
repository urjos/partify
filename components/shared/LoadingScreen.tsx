import { colors } from "@/constants/theme";
import clsx from "clsx";
import { styled } from "nativewind";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export interface LoadingScreenProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  className?: string;
}

export default function LoadingScreen({
  message,
  size = "large",
  color = colors.accentPink,
  fullScreen = true,
  overlay = false,
  className = "",
}: LoadingScreenProps) {
  if (overlay) {
    return (
      <View
        className={clsx(
          "absolute inset-0 z-50 bg-black/70 items-center justify-center px-6",
          className,
        )}
      >
        <View className="bg-card/95 rounded-3xl p-6 items-center justify-center gap-3 shadow-2xl min-w-[160px]">
          <ActivityIndicator size={size} color={color} />
          {message ? (
            <Text className="text-sm font-semibold text-primary text-center">
              {message}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  if (fullScreen) {
    return (
      <SafeAreaView
        className={clsx(
          "flex-1 bg-background items-center justify-center px-6",
          className,
        )}
      >
        <ActivityIndicator size={size} color={color} />
        {message ? (
          <Text className="text-sm font-medium text-muted-foreground mt-4 text-center">
            {message}
          </Text>
        ) : null}
      </SafeAreaView>
    );
  }

  return (
    <View className={clsx("items-center justify-center py-6 px-4", className)}>
      <ActivityIndicator size={size} color={color} />
      {message ? (
        <Text className="text-sm font-medium text-muted-foreground mt-3 text-center">
          {message}
        </Text>
      ) : null}
    </View>
  );
}
