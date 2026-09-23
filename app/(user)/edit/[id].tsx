import LoadingScreen from "@/components/shared/LoadingScreen";
import UserProfileForm from "@/components/profile/edit/UserProfileForm";
import "@/global.css";
import { useApi } from "@/hooks/use-api";
import { uploadUserAvatar } from "@/lib/storage";
import { UserProfile, useUserStore } from "@/lib/store/userStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useUser } from "@clerk/expo";

export default function EditProfileScreen() {
  const router = useRouter();
  const api = useApi();
  const { user } = useUser();
  const {
    profile,
    fetchProfile,
    saveProfile,
  } = useUserStore();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile(api);
  }, [api, fetchProfile]);

  const handleSubmit = async (
    draft: Partial<UserProfile>,
    options?: { avatarBase64?: string },
  ) => {
    setIsSaving(true);
    try {
      let finalAvatarUrl = draft.avatarUri;

      // The API performs server-side cleanup only after proving storage ownership.
      if (
        draft.avatarUri &&
        !draft.avatarUri.startsWith("http://") &&
        !draft.avatarUri.startsWith("https://")
      ) {
        if (!user?.id) throw new Error("No active Clerk user");
        finalAvatarUrl = await uploadUserAvatar(draft.avatarUri, {
          base64: options?.avatarBase64,
          userId: user?.id,
        });
      } else if (draft.avatarUri === null && profile.avatarUri) {
        // The API safely removes only an avatar owned by this Clerk user.
        finalAvatarUrl = null;
      }

      await saveProfile(api, {
        ...draft,
        avatarUri: finalAvatarUrl,
      });

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
    <>
      <UserProfileForm
        initialProfile={profile}
        isSaving={isSaving}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        onDeactivate={handleDeactivate}
        onAvatarChange={() => {}}
      />
      {isSaving && <LoadingScreen overlay message="Guardando perfil..." />}
    </>
  );
}
