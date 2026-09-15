import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface FormErrorMessageProps {
  message?: string | null;
  className?: string;
}

export default function FormErrorMessage({
  message,
  className = "",
}: FormErrorMessageProps) {
  if (!message) return null;

  return (
    <View className={`flex-row items-center gap-1.5 mt-1 px-1 ${className}`}>
      <Ionicons name="alert-circle" size={14} color={colors.delete} />
      <Text className="text-xs font-medium text-delete flex-1">{message}</Text>
    </View>
  );
}
