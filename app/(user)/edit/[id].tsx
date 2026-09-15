import EditAvatarSection from "@/components/profile/edit/EditAvatarSection";
import EditPrivacyCard from "@/components/profile/edit/EditPrivacyCard";
import EditProfileHeader from "@/components/profile/edit/EditProfileHeader";
import EditPublicDataCard from "@/components/profile/edit/EditPublicDataCard";
import EditSocialConnectionsCard from "@/components/profile/edit/EditSocialConnectionsCard";
import EditVibeMusicCard, {
  isValidSpotifyUrl,
} from "@/components/profile/edit/EditVibeMusicCard";
import images from "@/constants/images";
import { useApi } from "@/hooks/use-api";
import { useUserStore } from "@/lib/store/userStore";
import { useUser } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function EditProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const api = useApi();
  const { user } = useUser();
  const {
    profile,
    fetchProfile,
    saveProfile,
    setAvatarUri,
    linkSocial,
    unlinkSocial,
  } = useUserStore();

  // Local form state
  const [name, setName] = useState(
    profile.name ||
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      "Mateo Silva",
  );
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [genres, setGenres] = useState<string[]>(profile.genres);
  const [spotifyPlaylist, setSpotifyPlaylist] = useState(
    profile.spotifyPlaylist,
  );
  const [phone, setPhone] = useState(profile.phone);
  const [visibleInRadar, setVisibleInRadar] = useState(profile.visibleInRadar);
  const [avatarUri, setLocalAvatarUri] = useState<string | null>(
    profile.avatarUri,
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile(api);
  }, [api, fetchProfile]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Nombre requerido", "Por favor ingresa tu nombre completo.");
      return;
    }

    if (spotifyPlaylist.trim() && !isValidSpotifyUrl(spotifyPlaylist)) {
      Alert.alert(
        "Enlace de Spotify inválido",
        "Por favor ingresa un enlace válido de Spotify (ej. https://open.spotify.com/playlist/...) o déjalo vacío.",
      );
      return;
    }

    setIsSaving(true);
    try {
      await saveProfile(api, {
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        location: location.trim(),
        genres,
        spotifyPlaylist: spotifyPlaylist.trim(),
        socials: profile.socials,
        phone: phone.trim(),
        visibleInRadar,
        avatarUri,
      });

      router.back();
    } catch (error) {
      console.error("Save profile error:", error);
      Alert.alert(
        "Error al guardar",
        error instanceof Error
          ? error.message
          : "No se pudieron guardar los cambios en la base de datos. Por favor verifica la conexión.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = () => {
    Alert.alert(
      "Desactivar perfil nocturno",
      "Tu perfil dejará de ser visible temporalmente en el radar de fiestas y listas de asistentes. Podrás reactivarlo cuando quieras volviendo a iniciar sesión.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desactivar",
          style: "destructive",
          onPress: async () => {
            try {
              await saveProfile(api, { visibleInRadar: false });
            } catch (err) {
              console.warn(err);
            }
            router.back();
          },
        },
      ],
    );
  };

  const avatarSource = avatarUri
    ? { uri: avatarUri }
    : user?.imageUrl
      ? { uri: user.imageUrl }
      : images.avatar;

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <EditProfileHeader
        onCancel={() => router.back()}
        onSave={handleSubmit}
        isSaving={isSaving}
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40, gap: 24 }}
      >
        {/* Avatar Section */}
        <EditAvatarSection
          avatarSource={avatarSource}
          onAvatarChange={(uri) => {
            setLocalAvatarUri(uri);
            setAvatarUri(uri);
          }}
        />

        {/* Datos Públicos */}
        <EditPublicDataCard
          name={name}
          onNameChange={setName}
          username={username}
          onUsernameChange={setUsername}
          bio={bio}
          onBioChange={setBio}
          location={location}
          onChangeLocation={setLocation}
        />

        {/* Identidad Sonora & Vibra */}
        <EditVibeMusicCard
          genres={genres}
          onGenresChange={setGenres}
          spotifyPlaylist={spotifyPlaylist}
          onSpotifyPlaylistChange={setSpotifyPlaylist}
        />

        {/* Conexión & Pagos Directos */}
        <EditSocialConnectionsCard
          socials={profile.socials}
          onLinkSocial={linkSocial}
          onUnlinkSocial={unlinkSocial}
          phone={phone}
          onPhoneChange={setPhone}
        />

        {/* Privacidad & Verificación */}
        <EditPrivacyCard
          visibleInRadar={visibleInRadar}
          onVisibleInRadarChange={setVisibleInRadar}
        />

        {/* Botón Principal Guardar */}
        <View className="gap-2">
          <Pressable
            onPress={handleSubmit}
            disabled={isSaving}
            className="w-full rounded-2xl overflow-hidden active:opacity-85 p-4 bg-accent-pink shadow-lg shadow-accent-pink/20 items-center justify-center"
          >
            <Text className="text-base font-bold text-primary text-center">
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </Text>
          </Pressable>

          {/* Botón Desactivar */}
          <Pressable
            onPress={handleDeactivate}
            className="items-center py-4 active:opacity-75"
          >
            <Text className="text-xs font-semibold text-delete">
              Desactivar temporalmente mi perfil
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
