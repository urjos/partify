import CategoryChips from "@/components/shared/CategoryChips";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { MUSIC_TYPES } from "@/constants/categories";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface EditVibeMusicCardProps {
  genres: string[];
  onGenresChange: (genres: string[]) => void;
  spotifyPlaylist: string;
  onSpotifyPlaylistChange: (url: string) => void;
}

export const isValidSpotifyUrl = (url: string): boolean => {
  if (!url || url.trim() === "") return false;
  const clean = url.trim();
  const spotifyRegex =
    /^https?:\/\/(open\.)?spotify\.com\/(playlist|album|track|artist)\/[a-zA-Z0-9]+(\?.*)?$/i;
  return spotifyRegex.test(clean);
};

export default function EditVibeMusicCard({
  genres,
  onGenresChange,
  spotifyPlaylist,
  onSpotifyPlaylistChange,
}: EditVibeMusicCardProps) {
  const [showAllGenres, setShowAllGenres] = useState(false);

  const displayedGenres = showAllGenres ? MUSIC_TYPES : MUSIC_TYPES.slice(0, 6);

  const handleToggleGenre = (genre: string | null) => {
    if (!genre) return;
    if (genres.includes(genre)) {
      onGenresChange(genres.filter((g) => g !== genre));
    } else {
      onGenresChange([...genres, genre]);
    }
  };

  const isSpotifyValid = isValidSpotifyUrl(spotifyPlaylist);
  const spotifyHasText = spotifyPlaylist.trim().length > 0;
  const spotifyError =
    spotifyHasText && !isSpotifyValid
      ? "Ingresa un enlace válido de Spotify (ej. https://open.spotify.com/playlist/...)"
      : null;

  const handleTestSpotify = async () => {
    if (!isSpotifyValid) {
      Alert.alert(
        "Enlace inválido",
        "Por favor ingresa un enlace válido de Spotify antes de probarlo.",
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(spotifyPlaylist);
      if (supported) {
        await Linking.openURL(spotifyPlaylist);
      } else {
        await Linking.openURL(spotifyPlaylist);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir el enlace de Spotify.");
    }
  };

  return (
    <View className="gap-2">
      <View className="flex-row items-center px-1">
        <Text className="text-lg font-bold text-primary">Vibra musical</Text>
      </View>

      <View className="gap-4">
        {/* Géneros que definen tus noches */}
        <View className="bg-modal-background rounded-3xl p-4 gap-2">
          <Text className="text-xs font-semibold text-muted-foreground">
            Géneros que definen tus noches:
          </Text>

          <CategoryChips
            items={displayedGenres}
            selected={genres}
            onSelect={handleToggleGenre}
            renderExtra={
              <Pressable
                onPress={() => setShowAllGenres(!showAllGenres)}
                className="items-center justify-center active:opacity-75"
              >
                <Text className="font-semibold text-muted-foreground text-xs">
                  {showAllGenres ? "Ver menos" : "+ Más géneros"}
                </Text>
              </Pressable>
            }
          />
        </View>

        {/* Playlist de calentamiento (Spotify) */}
        <View className="bg-modal-background rounded-3xl p-4 gap-2">
          <Text className="text-xs font-semibold text-muted-foreground">
            Playlist de calentamiento (Spotify)
          </Text>

          <View className="flex-row items-center border border-card px-1 rounded-2xl gap-1">
            {/* Logo de Spotify */}
            <Image
              source={icons.spotify}
              className="size-4"
              resizeMode="contain"
              tintColor={colors.mutedForeground}
            />

            <TextInput
              className="flex-1 text-sm font-medium text-primary"
              value={spotifyPlaylist}
              onChangeText={(text) =>
                onSpotifyPlaylistChange(text.replace(/\s/g, ""))
              }
              placeholder="https://open.spotify.com/playlist/..."
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />

            <Pressable
              onPress={handleTestSpotify}
              disabled={!isSpotifyValid}
              className={`px-1 rounded-xl active:opacity-75 ${
                !isSpotifyValid && "opacity-40"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isSpotifyValid
                    ? "text-muted-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Probar
              </Text>
            </Pressable>
          </View>

          <FormErrorMessage message={spotifyError} />
        </View>
      </View>
    </View>
  );
}
