import LocationSearchModal from "@/components/shared/LocationSearchModal";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { useApi } from "@/hooks/use-api";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from "react-native";

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
  const api = useApi();

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null,
  );
  const [showLocationModal, setShowLocationModal] = useState(false);

  const handleUsernameChange = (text: string) => {
    // Keep lowercased without spaces or invalid chars
    const clean = text.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();
    onUsernameChange(clean);
  };

  useEffect(() => {
    const clean = username.trim().toLowerCase();
    if (clean.length < 3) {
      setUsernameAvailable(null);
      setIsCheckingUsername(false);
      return;
    }

    setIsCheckingUsername(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await api.get<{
          success: boolean;
          data: { available: boolean; username: string };
        }>(`/users/check-username?username=${encodeURIComponent(clean)}`);

        if (res?.success && res.data) {
          setUsernameAvailable(res.data.available);
        }
      } catch (err) {
        console.warn("Username availability check error:", err);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [username, api]);

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
            className="text-base font-medium text-primary rounded-xl border border-card px-3 py-2"
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

            {isCheckingUsername ? (
              <View className="flex-row items-center gap-1">
                <ActivityIndicator size="small" color={colors.mutedForeground} />
                <Text className="text-xs font-medium text-muted-foreground">
                  Comprobando...
                </Text>
              </View>
            ) : username.trim().length >= 3 && usernameAvailable === true ? (
              <View className="flex-row items-center gap-1 bg-success/15 px-2 py-1 rounded-full">
                <Ionicons name="checkmark-circle" size={12} color="#22c55e" />
                <Text className="text-xs font-semibold text-success">
                  Disponible
                </Text>
              </View>
            ) : username.trim().length >= 3 && usernameAvailable === false ? (
              <View className="flex-row items-center gap-1 bg-delete/15 px-2 py-1 rounded-full">
                <Ionicons name="close-circle" size={12} color="#ef4444" />
                <Text className="text-xs font-semibold text-delete">
                  No disponible
                </Text>
              </View>
            ) : username.trim().length > 0 && username.trim().length < 3 ? (
              <Text className="text-xs font-medium text-muted-foreground">
                Mínimo 3 caracteres
              </Text>
            ) : null}
          </View>

          <View className="text-base font-medium text-primary rounded-xl border border-card flex-row items-center px-3">
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
              autoCorrect={false}
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
            className="text-sm font-medium text-primary rounded-xl border border-card px-3 py-2"
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

        {/* Ubicación predeterminada con Google Maps Places Search */}
        <View className="bg-modal-background p-4 rounded-3xl gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold text-muted-foreground">
              Ubicación predeterminada
            </Text>
            <Pressable
              onPress={() => setShowLocationModal(true)}
              hitSlop={6}
              className="flex-row items-center gap-1 active:opacity-75"
            >
              <Text className="text-xs font-semibold text-accent-pink">
                Buscar en mapa
              </Text>
              <Ionicons
                name="chevron-forward"
                size={12}
                color={colors.accentPink}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={() => setShowLocationModal(true)}
            className="rounded-xl border border-card flex-row items-center px-3 py-2.5 active:opacity-85"
          >
            <Image
              source={icons.mapPin}
              tintColor={colors.accentPink}
              className="size-4 mr-2"
              resizeMode="contain"
            />
            <Text
              numberOfLines={1}
              className={`flex-1 text-sm font-medium ${
                location ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {location || "Selecciona tu distrito o ubicación"}
            </Text>
            <Text className="text-xs font-semibold text-muted-foreground ml-2">
              Cambiar
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Modal de Búsqueda de Ubicación estilo Google Maps */}
      <LocationSearchModal
        visible={showLocationModal}
        currentLocation={location}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={onChangeLocation}
      />
    </View>
  );
}
