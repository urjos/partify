import EditAvatarSection from "@/components/profile/edit/EditAvatarSection";
import EditPrivacyCard from "@/components/profile/edit/EditPrivacyCard";
import EditProfileHeader from "@/components/profile/edit/EditProfileHeader";
import EditPublicDataCard from "@/components/profile/edit/EditPublicDataCard";
import EditSocialConnectionsCard from "@/components/profile/edit/EditSocialConnectionsCard";
import EditVibeMusicCard, {
  isValidSpotifyUrl,
} from "@/components/profile/edit/EditVibeMusicCard";
import images from "@/constants/images";
import { UserProfile, UserSocials } from "@/lib/store/userStore";
import { useUser } from "@clerk/expo";
import { styled } from "nativewind";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

interface UserProfileFormProps {
  initialProfile: UserProfile;
  isSaving: boolean;
  onSubmit: (draft: Partial<UserProfile>) => Promise<void>;
  onCancel: () => void;
  onDeactivate: () => void;
  onAvatarChange: (uri: string) => void;
  onLinkSocial: (network: keyof UserSocials, handle: string) => void;
  onUnlinkSocial: (network: keyof UserSocials) => void;
}

export default function UserProfileForm({
  initialProfile,
  isSaving,
  onSubmit,
  onCancel,
  onDeactivate,
  onAvatarChange,
  onLinkSocial,
  onUnlinkSocial,
}: UserProfileFormProps) {
  const { user } = useUser();

  // Local form state
  const [name, setName] = useState(
    initialProfile.name ||
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      "",
  );
  const [username, setUsername] = useState(initialProfile.username || "");
  const [bio, setBio] = useState(initialProfile.bio || "");
  const [location, setLocation] = useState(initialProfile.location || "");
  const [genres, setGenres] = useState<string[]>(initialProfile.genres || []);
  const [spotifyPlaylist, setSpotifyPlaylist] = useState(
    initialProfile.spotifyPlaylist || "",
  );
  const [phone, setPhone] = useState(initialProfile.phone || "");
  const [visibleInRadar, setVisibleInRadar] = useState(
    initialProfile.visibleInRadar ?? true,
  );
  const [avatarUri, setLocalAvatarUri] = useState<string | null>(
    initialProfile.avatarUri || null,
  );

  // Sync if initialProfile changes from API load
  useEffect(() => {
    if (initialProfile.name) setName(initialProfile.name);
    if (initialProfile.username) setUsername(initialProfile.username);
    if (initialProfile.bio) setBio(initialProfile.bio);
    if (initialProfile.location) setLocation(initialProfile.location);
    if (initialProfile.genres && initialProfile.genres.length > 0) {
      setGenres(initialProfile.genres);
    }
    if (initialProfile.spotifyPlaylist) {
      setSpotifyPlaylist(initialProfile.spotifyPlaylist);
    }
    if (initialProfile.phone) setPhone(initialProfile.phone);
    if (initialProfile.visibleInRadar !== undefined) {
      setVisibleInRadar(initialProfile.visibleInRadar);
    }
    if (initialProfile.avatarUri) setLocalAvatarUri(initialProfile.avatarUri);
  }, [initialProfile]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Nombre requerido", "Por favor ingresa tu nombre completo.");
      return;
    }

    if (username.trim() && username.trim().length < 3) {
      Alert.alert(
        "Nombre de usuario inválido",
        "El nombre de usuario debe tener al menos 3 caracteres.",
      );
      return;
    }

    if (spotifyPlaylist.trim() && !isValidSpotifyUrl(spotifyPlaylist)) {
      Alert.alert(
        "Enlace de Spotify inválido",
        "Por favor ingresa un enlace válido de Spotify (ej. https://open.spotify.com/playlist/...) o déjalo vacío.",
      );
      return;
    }

    await onSubmit({
      name: name.trim(),
      username: username.trim(),
      bio: bio.trim(),
      location: location.trim(),
      genres,
      spotifyPlaylist: spotifyPlaylist.trim(),
      socials: initialProfile.socials,
      phone: phone.trim(),
      visibleInRadar,
      avatarUri,
    });
  };

  const avatarSource = avatarUri
    ? { uri: avatarUri }
    : user?.imageUrl
      ? { uri: user.imageUrl }
      : images.avatar;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <EditProfileHeader
        onCancel={onCancel}
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
            onAvatarChange(uri);
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
          socials={initialProfile.socials}
          onLinkSocial={onLinkSocial}
          onUnlinkSocial={onUnlinkSocial}
          phone={phone}
          onPhoneChange={setPhone}
        />

        {/* Privacidad & Verificación */}
        <EditPrivacyCard
          visibleInRadar={visibleInRadar}
          onVisibleInRadarChange={setVisibleInRadar}
        />

        {/* Botón Principal Guardar */}
        <View className="gap-2 pt-2">
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
            onPress={onDeactivate}
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
