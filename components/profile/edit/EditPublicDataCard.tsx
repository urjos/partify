import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

interface EditPublicDataCardProps {
  name: string;
  onNameChange: (text: string) => void;
  username: string;
  onUsernameChange: (text: string) => void;
  bio: string;
  onBioChange: (text: string) => void;
  location: string;
  onChangeLocation: (text: string) => void;
}

export default function EditPublicDataCard({
  name,
  onNameChange,
  username,
  onUsernameChange,
  bio,
  onBioChange,
  location,
  onChangeLocation,
}: EditPublicDataCardProps) {
  const maxBio = 150;

  const handleUsernameChange = (text: string) => {
    // Keep lowercased without spaces
    const clean = text.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();
    onUsernameChange(clean);
  };

  return (
    <View className="gap-2">
      <Text className="text-lg font-bold text-primary">Datos públicos</Text>

      <View className="rounded-3xl gap-4">
        {/* Nombre completo */}
        <View className="bg-modal-background p-4 rounded-3xl gap-1">
          <Text className="text-xs font-semibold text-muted-foreground">
            Nombre completo
          </Text>
          <TextInput
            className="text-base font-medium text-primary rounded-xl border border-card px-2 py-2"
            value={name}
            onChangeText={onNameChange}
            placeholder="Tu nombre completo"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        {/* Nombre de usuario */}
        <View className="bg-modal-background p-4 rounded-3xl gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold text-muted-foreground">
              Nombre de usuario
            </Text>
            {username.trim().length >= 3 && (
              <View className="flex-row items-center gap-1 bg-success/15 px-2 py-1 rounded-full">
                <Ionicons name="checkmark-circle" size={12} color="#22c55e" />
                <Text className="text-xs font-semibold text-success">
                  Disponible
                </Text>
              </View>
            )}
          </View>
          <View className="text-base font-medium text-primary rounded-xl border border-card flex-row items-center px-2">
            <Text className="text-base font-bold text-accent-pink mr-0.5">
              @
            </Text>
            <TextInput
              className="flex-1 text-base font-medium text-primary py-2"
              value={username}
              onChangeText={handleUsernameChange}
              placeholder="tuusuario"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Biografía / Sobre ti */}
        <View className="bg-modal-background p-4 rounded-3xl gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold text-muted-foreground">
              Biografía / Sobre ti
            </Text>
            <Text className="text-xs font-semibold text-muted-foreground">
              {bio.length}/{maxBio}
            </Text>
          </View>
          <TextInput
            className="text-sm font-medium text-primary rounded-xl border border-card px-2 py-2"
            value={bio}
            onChangeText={onBioChange}
            placeholder="Cuéntanos sobre ti, tus planes y qué te mueve en las noches..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={3}
            maxLength={maxBio}
            textAlignVertical="top"
          />
        </View>

        {/* Ubicación predeterminada */}
        <View className="bg-modal-background p-4 rounded-3xl gap-1">
          <Text className="text-xs font-semibold text-muted-foreground">
            Ubicación predeterminada
          </Text>
          <View className="text-base font-medium text-primary rounded-xl border border-card flex-row items-center px-2">
            <Image
              source={icons.mapPin}
              tintColor={colors.accentPink}
              className="size-4 mr-2"
              resizeMode="contain"
            />
            <TextInput
              className="flex-1 text-base font-medium text-primary py-2"
              value={location}
              onChangeText={onChangeLocation}
              placeholder="Miraflores, Lima"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
