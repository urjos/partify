import { colors } from "@/constants/theme";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface EditProfileHeaderProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function EditProfileHeader({
  onCancel,
  onSave,
  isSaving = false,
}: EditProfileHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 py-4">
      <Pressable onPress={onCancel} hitSlop={10} className="active:opacity-70">
        <Text className="text-base font-medium text-muted-foreground">
          Cancelar
        </Text>
      </Pressable>

      <Text className="text-lg font-bold text-primary">Editar Perfil</Text>

      <Pressable
        onPress={onSave}
        disabled={isSaving}
        hitSlop={10}
        className="active:opacity-70"
      >
        <Text className="text-base font-bold text-accent-pink">
          {isSaving ? "Guardando..." : "Guardar"}
        </Text>
      </Pressable>
    </View>
  );
}
