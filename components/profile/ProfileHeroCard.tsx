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

export interface ProfileHeroCardProps {
  name: string;
  username?: string;
  badgeText?: string;
  location?: string;
  avatarSource?: ImageSourcePropType | { uri: string };
  bio?: string | null;
  isVerified?: boolean;
  isOnline?: boolean;
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  onEditPress?: () => void;
  showEditButton?: boolean;
  showContactButton?: boolean;
  onContactPress?: () => void;
}

export default function ProfileHeroCard({
  name,
  username,
  badgeText,
  location,
  avatarSource,
  bio,
  isVerified = true,
  isOnline = true,
  socials,
  onEditPress,
  showEditButton,
  showContactButton = false,
  onContactPress,
}: ProfileHeroCardProps) {
  const resolvedAvatar = avatarSource || images.avatar;
  const displayEdit = showEditButton ?? Boolean(onEditPress);

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
    socials?.instagram?.trim() || socials?.tiktok?.trim(),
  );

  return (
    <View className="bg-modal-background rounded-3xl p-6 items-center border-none relative overflow-hidden">
      {/* Botón de editar (si aplica) */}
      {displayEdit && onEditPress && (
        <Pressable
          onPress={onEditPress}
          className="rounded-full p-3 absolute right-4 top-4 gap-2 active:opacity-75 z-10"
          hitSlop={8}
        >
          <Image
            source={icons.pencil}
            className="size-4"
            tintColor={colors.mutedForeground}
          />
        </Pressable>
      )}

      {/* Resplandor decorativo superior estilo neón */}
      <View
        pointerEvents="none"
        className="absolute -top-10 w-44 h-44 rounded-full bg-accent-pink/15 blur-3xl"
      />

      {/* Avatar circular con anillo neón y dot de estado */}
      <View className="relative">
        <View className="p-1 rounded-full border-2 border-accent-pink shadow-lg shadow-accent-pink/40 items-center justify-center">
          <Image
            source={resolvedAvatar}
            className="size-24 rounded-full"
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Nombre y badge verificado */}
      <View className="flex-row items-center justify-center gap-1.5 mt-4">
        <Text
          numberOfLines={1}
          className="text-xl font-extrabold text-primary text-center"
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

      <View className="flex justify-center items-center gap-4 w-full">
        {/* Badges / Username */}
        {username?.trim() ? (
          <Text className="text-xs font-semibold text-muted-foreground">
            @{username.replace(/^@/, "")}
          </Text>
        ) : null}

        {/* Ubicación */}
        {location?.trim() ? (
          <Text className="text-xs font-medium text-muted-foreground">
            {location}
          </Text>
        ) : null}
      </View>

      {/* Biografía */}
      {bio?.trim() ? (
        <Text className="text-xs font-medium text-muted-foreground text-center mt-3 px-2 leading-relaxed">
          {bio}
        </Text>
      ) : (
        <Text className="text-xs font-medium text-muted-foreground text-center mt-3 px-2 leading-relaxed">
          Sin biografía aún.
        </Text>
      )}

      {/* Iconos de Redes Sociales Vinculadas */}
      {hasSocials && (
        <View className="flex-row items-center justify-center gap-1 mt-3.5">
          {socials?.instagram?.trim() ? (
            <Pressable
              onPress={() => openSocialLink("instagram", socials.instagram!)}
              className="size-9 rounded-full items-center justify-center active:opacity-75"
              hitSlop={8}
            >
              <Image
                source={icons.instagram}
                className="size-5"
                resizeMode="contain"
                tintColor={colors.mutedForeground}
              />
            </Pressable>
          ) : null}

          {socials?.tiktok?.trim() ? (
            <Pressable
              onPress={() => openSocialLink("tiktok", socials.tiktok!)}
              className="size-9 rounded-full items-center justify-center active:opacity-75"
              hitSlop={8}
            >
              <Image
                source={icons.tiktok}
                className="size-6"
                resizeMode="contain"
                tintColor={colors.mutedForeground}
              />
            </Pressable>
          ) : null}
        </View>
      )}

      {/* Botón de Contacto */}
      {(showContactButton || onContactPress) && (
        <Pressable
          onPress={onContactPress}
          className="w-full bg-submodal-background border border-card rounded-full py-3 px-4 flex-row items-center justify-center gap-2 mt-4 active:opacity-80"
        >
          <Image
            source={icons.messageSquareText}
            className="size-4"
            tintColor={colors.mutedForeground}
          />
          <Text className="text-sm font-medium text-primary">Contactar</Text>
        </Pressable>
      )}
    </View>
  );
}
