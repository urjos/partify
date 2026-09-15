import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import { useUser } from "@clerk/expo";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

interface EditAvatarSectionProps {
  avatarSource?: ImageSourcePropType | { uri: string };
  onAvatarChange: (uri: string) => void;
}

export default function EditAvatarSection({
  avatarSource,
  onAvatarChange,
}: EditAvatarSectionProps) {
  const { user } = useUser();

  const isSourceValid =
    avatarSource &&
    (typeof avatarSource !== "object" ||
      ("uri" in avatarSource && Boolean(avatarSource.uri)));

  const resolvedAvatar = isSourceValid
    ? avatarSource!
    : user?.imageUrl
    ? { uri: user.imageUrl }
    : images.avatar;

  const handlePickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permisos requeridos",
          "Necesitamos acceso a tus fotos para cambiar tu foto de perfil.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        onAvatarChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar foto:", error);
    }
  };

  return (
    <View className="items-center justify-center my-4 relative">
      {/* Resplandor decorativo superior estilo neón */}
      <View
        pointerEvents="none"
        className="absolute -top-6 w-44 h-44 rounded-full bg-accent-pink/20 blur-3xl"
      />

      {/* Avatar circular con anillo neón (idéntico a ProfileHeroCard) */}
      <View className="p-1 rounded-full border-2 border-accent-pink shadow-lg shadow-accent-pink/40 items-center justify-center">
        <Image
          source={resolvedAvatar}
          className="size-24 rounded-full"
          resizeMode="cover"
        />
      </View>

      {/* Botón Cambiar foto */}
      <Pressable
        onPress={handlePickImage}
        className="mt-3 flex-row items-center gap-1.5 px-4 py-2 rounded-full bg-modal-background active:opacity-75"
      >
        <Image
          source={icons.cameraAdd}
          className="size-4"
          tintColor={colors.primary}
          resizeMode="contain"
        />
        <Text className="text-xs font-semibold text-primary">Cambiar foto</Text>
      </Pressable>
    </View>
  );
}
