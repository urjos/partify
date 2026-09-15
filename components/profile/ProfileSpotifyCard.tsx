import { icons } from "@/constants/icons";
import React from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import { isValidSpotifyUrl } from "./edit/EditVibeMusicCard";

interface ProfileSpotifyCardProps {
  playlistUrl?: string | null;
  onEditPress?: () => void;
}

export default function ProfileSpotifyCard({
  playlistUrl,
  onEditPress,
}: ProfileSpotifyCardProps) {
  if (!playlistUrl || !isValidSpotifyUrl(playlistUrl)) {
    return null;
  }

  const handleOpenSpotify = async () => {
    try {
      await Linking.openURL(playlistUrl);
    } catch (error) {
      console.error("Error al abrir Spotify:", error);
    }
  };

  return (
    <View className="bg-modal-background rounded-3xl p-4 gap-3 border border-border/20">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-xs font-bold text-muted-foreground">
            Playlist de calentamiento
          </Text>
        </View>
      </View>

      <Pressable
        onPress={handleOpenSpotify}
        className="flex-row items-center justify-center gap-2 py-3 rounded-2xl bg-submodal-background active:opacity-75"
      >
        <Image
          source={icons.spotify}
          className="size-4"
          resizeMode="contain"
          tintColor="#33DB70"
        />
        <Text className="text-xs font-bold text-primary">
          Escuchar en Spotify
        </Text>
      </Pressable>
    </View>
  );
}
