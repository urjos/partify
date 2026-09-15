import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";

interface ProfileHeroCardProps {
  name: string;
  avatarSource?: ImageSourcePropType | { uri: string };
  bio?: string | null;
  isVerified?: boolean;
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
}

export default function ProfileHeroCard({
  name,
  avatarSource,
  bio,
  isVerified = true,
  socials,
}: ProfileHeroCardProps) {
  const resolvedAvatar = avatarSource || images.avatar;

  const openSocialLink = async (
    network: "instagram" | "tiktok",
    handle: string,
  ) => {
    const clean = handle.replace(/^@/, "").trim();
    if (!clean) return;

    let url = "";
    if (network === "instagram") {
      url = `https://instagram.com/${clean}`;
    } else if (network === "tiktok") {
      url = `https://tiktok.com/@${clean}`;
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(`Error al abrir ${network}:`, error);
    }
  };

  const hasSocials = Boolean(
    socials?.instagram?.trim() ||
    socials?.facebook?.trim() ||
    socials?.tiktok?.trim(),
  );

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

      {/* Iconos de Redes Sociales Vinculadas */}
      {hasSocials && (
        <View className="flex-row items-center justify-center gap-3 mt-4">
          {socials?.instagram?.trim() ? (
            <Pressable
              onPress={() => openSocialLink("instagram", socials.instagram!)}
              className=" items-center justify-center active:opacity-75"
            >
              <Image
                source={icons.instagram}
                className="size-7"
                resizeMode="contain"
                tintColor={colors.mutedForeground}
              />
            </Pressable>
          ) : null}

          {socials?.tiktok?.trim() ? (
            <Pressable
              onPress={() => openSocialLink("tiktok", socials.tiktok!)}
              className="items-center justify-center active:opacity-75"
            >
              <Image
                source={icons.tiktok}
                className="size-7"
                resizeMode="contain"
                tintColor={colors.mutedForeground}
              />
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}
