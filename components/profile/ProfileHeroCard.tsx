import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import React from "react";
import { Image, ImageSourcePropType, Text, View } from "react-native";

interface ProfileHeroCardProps {
  name: string;
  avatarSource?: ImageSourcePropType | { uri: string };
  bio?: string | null;
  isVerified?: boolean;
}

export default function ProfileHeroCard({
  name,
  avatarSource,
  bio,
  isVerified = true,
}: ProfileHeroCardProps) {
  const resolvedAvatar = avatarSource || images.avatar;

  return (
    <View className="bg-modal-background rounded-3xl p-6 items-center border-none relative overflow-hidden">
      {/* Resplandor decorativo superior estilo neón */}
      <View
        pointerEvents="none"
        className="absolute -top-10 w-44 h-44 rounded-full bg-accent-pink/15 blur-3xl"
      />

      {/* Avatar circular con anillo neón */}
      <View className="p-1 rounded-full border-2 border-accent-pink shadow-lg shadow-accent-pink/40 items-center justify-center">
        <Image
          source={resolvedAvatar}
          className="size-24 rounded-full"
          resizeMode="cover"
        />
      </View>

      {/* Nombre y badge verificado */}
      <View className="flex-row items-center justify-center gap-1.5 mt-4">
        <Text
          numberOfLines={1}
          className="text-xl font-bold text-primary text-center"
        >
          {name}
        </Text>
        {isVerified && (
          <Image
            source={icons.verified}
            tintColor={colors.accentPink}
            className="size-4"
          />
        )}
      </View>

      {/* Biografía */}
      {bio?.trim() ? (
        <Text className="text-xs font-medium text-muted-foreground text-center mt-2 px-3 leading-relaxed">
          {bio}
        </Text>
      ) : (
        <Text className="text-xs font-medium text-muted-foreground text-center mt-2 px-3 leading-relaxed">
          No hay biografía, aún.
        </Text>
      )}
    </View>
  );
}
