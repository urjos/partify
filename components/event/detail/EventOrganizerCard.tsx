import VerifiedBadge from "@/components/VerifiedBadge";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface EventOrganizerCardProps {
  author: string;
  authorAvatar?: string;
  authorIsVerified?: boolean;
  rating?: number;
  onViewProfile?: () => void;
}

export default function EventOrganizerCard({
  author,
  authorAvatar,
  authorIsVerified = false,
  rating,
  onViewProfile,
}: EventOrganizerCardProps) {
  return (
    <View className="bg-modal-background rounded-2xl p-4 gap-3">
      <Text className="text-lg font-bold text-primary">Organizado por</Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1 pr-3">
          {/* Avatar con dot indicador */}
          <View className="relative">
            <Image
              source={authorAvatar ? { uri: authorAvatar } : images.avatar}
              className="size-12 rounded-full"
            />
            <View className="absolute bottom-0 right-0 size-3.5 rounded-full bg-accent-pink border-2 border-card" />
          </View>

          {/* Info del anfitrión */}
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text
                className="text-base font-bold text-primary"
                numberOfLines={1}
              >
                {author}
              </Text>
              <VerifiedBadge
                isVerified={authorIsVerified}
                size={14}
                tintColor={colors.accentPink}
              />
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-xs font-semibold text-accent-pink">
                {rating && rating > 0 ? rating.toFixed(1) : "5.0"}
              </Text>
              <Image
                source={icons.star}
                className="size-2.5"
                tintColor={colors.accentPink}
              />
              <Text className="text-xs text-muted-foreground">·</Text>
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                Anfitrión
              </Text>
            </View>
          </View>
        </View>

        {/* Botón Ver Perfil */}
        <Pressable
          onPress={onViewProfile}
          className="bg-modal-background border border-border px-4 py-2 rounded-full active:opacity-75"
        >
          <Text className="text-xs font-bold text-primary">Ver Perfil</Text>
        </Pressable>
      </View>
    </View>
  );
}
