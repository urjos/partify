import UserProfileForm from "@/components/profile/edit/UserProfileForm";
import "@/global.css";
import { useApi } from "@/hooks/use-api";
import { UserProfile, useUserStore } from "@/lib/store/userStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function EditProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const api = useApi();
  const {
    profile,
    fetchProfile,
    saveProfile,
    setAvatarUri,
  } = useUserStore();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile(api);
  }, [api, fetchProfile]);

  const handleSubmit = async (draft: Partial<UserProfile>) => {
    setIsSaving(true);
    try {
      await saveProfile(api, draft);
      router.back();
    } catch (error) {
      console.error("Save profile error:", error);
      Alert.alert(
        "No se pudieron guardar los cambios",
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar en la base de datos.",
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

  return (
    <UserProfileForm
      initialProfile={profile}
      isSaving={isSaving}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      onDeactivate={handleDeactivate}
      onAvatarChange={(uri) => setAvatarUri(uri)}
    />
  );
}
