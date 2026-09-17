import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface UserRatingCardProps {
  userRating?: number | null;
  onRate: (score: number) => void;
  disabled?: boolean;
}

export default function UserRatingCard({
  userRating,
  onRate,
  disabled = false,
}: UserRatingCardProps) {
  const currentScore = userRating ?? 0;
  const hasRated = currentScore > 0;
  const isInteractionDisabled = disabled || hasRated;

  return (
    <View className="bg-modal-background rounded-3xl p-5 items-center justify-center gap-3 border border-border/20">
      <Text className="text-sm font-bold text-primary">
        Calificar anfitrión
      </Text>

      {/* Selector de 5 estrellas */}
      <View className="flex-row items-center gap-4 py-1">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= currentScore;
          return (
            <Pressable
              key={starIndex}
              onPress={() => !isInteractionDisabled && onRate(starIndex)}
              disabled={isInteractionDisabled}
              hitSlop={8}
              className="active:opacity-60"
            >
              <Ionicons
                name={isFilled ? "star" : "star-outline"}
                size={28}
                color={
                  isFilled ? colors.accentPink : "rgba(245, 244, 242, 0.3)"
                }
              />
            </Pressable>
          );
        })}
      </View>

      {/* Mensaje de agradecimiento una vez calificado */}
      {hasRated ? (
        <View className="bg-chip-background/80 px-4 py-1.5 rounded-full mt-1">
          <Text className="text-xs font-semibold text-accent-pink tracking-wide">
            Gracias por tu calificación
          </Text>
        </View>
      ) : (
        <Text className="text-xs font-medium text-muted-foreground">
          Toca una estrella para evaluar la reputación
        </Text>
      )}
    </View>
  );
}
