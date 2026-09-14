import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

interface EventRatingStarsProps {
  userRating?: number | null;
  averageRating?: number;
  ratingsCount?: number;
  onRate: (score: number) => void;
  disabled?: boolean;
}

export default function EventRatingStars({
  userRating,
  averageRating = 0,
  ratingsCount = 0,
  onRate,
  disabled = false,
}: EventRatingStarsProps) {
  const currentScore = userRating ?? 0;

  return (
    <View className="flex-row items-center justify-center ">
      <View className="flex-row items-center gap-5">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= currentScore;
          return (
            <Pressable
              key={starIndex}
              onPress={() => !disabled && onRate(starIndex)}
              disabled={disabled}
              hitSlop={10}
              className="active:opacity-60"
            >
              <Ionicons
                name={isFilled ? "star" : "star-outline"}
                size={25}
                color={
                  isFilled ? colors.accentPink : "rgba(245, 244, 242, 0.3)"
                }
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
