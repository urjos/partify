import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface EditContactCardProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
}

export default function EditContactCard({
  phone,
  onPhoneChange,
}: EditContactCardProps) {
  const [editingPhone, setEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState("");

  const openPhoneModal = () => {
    setEditingPhone(true);
    setTempPhone(phone || "");
  };

  const handleSavePhone = () => {
    onPhoneChange(tempPhone.trim());
    setEditingPhone(false);
  };

  return (
    <View className="gap-2">
      <Text className="text-lg font-bold text-primary">Contacto directo</Text>

      <View className="bg-modal-background rounded-3xl p-4 gap-4">
        {/* Teléfono WhatsApp */}
        <Pressable
          onPress={openPhoneModal}
          className="flex-row items-center justify-between py-1 active:opacity-75"
        >
          <View className="flex-row items-center gap-3 flex-1">
            <Image
              source={icons.phone}
              className="size-5"
              resizeMode="contain"
              tintColor={colors.mutedForeground}
            />
            <View className="flex-1">
              <Text className="text-xs font-semibold text-muted-foreground">
                Teléfono de contacto (WhatsApp)
              </Text>
              <Text className="text-sm font-medium text-primary mt-0.5">
                {phone || "No configurado"}
              </Text>
            </View>
          </View>

          <Text className="text-xs font-bold text-muted-foreground">
            Editar
          </Text>
        </Pressable>
      </View>

      {/* Modal para Editar Teléfono */}
      <Modal
        visible={editingPhone}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingPhone(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          {/* Backdrop con Blur */}
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setEditingPhone(false)}
          >
            <BlurView
              intensity={10}
              tint="dark"
              style={StyleSheet.absoluteFillObject}
            />
            <View
              style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: colors.BackgroundModal },
              ]}
            />
          </Pressable>

          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-modal-background rounded-3xl p-5 gap-4"
          >
            <View className="flex-row items-center gap-2.5">
              <Image
                source={icons.phone}
                className="size-5"
                tintColor={colors.primary}
                resizeMode="contain"
              />
              <Text className="text-lg font-bold text-primary">
                Editar Teléfono
              </Text>
            </View>

            <Text className="text-xs text-muted-foreground">
              Ingresa tu número de contacto para coordinar con otros usuarios o
              asistentes de tus eventos.
            </Text>

            <View className="flex-row items-center bg-card rounded-2xl px-3.5 py-2.5 border border-border/40">
              <TextInput
                className="flex-1 text-sm font-semibold text-primary"
                value={tempPhone}
                onChangeText={setTempPhone}
                placeholder="+51 987 654 321"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                autoFocus
              />
            </View>

            <View className="flex-row gap-3 mt-2">
              <Pressable
                onPress={() => setEditingPhone(false)}
                className="flex-1 items-center justify-center py-3 rounded-2xl bg-card active:opacity-75"
              >
                <Text className="text-sm font-bold text-muted-foreground">
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSavePhone}
                className="flex-1 items-center justify-center py-3 rounded-2xl bg-accent-pink active:opacity-85"
              >
                <Text className="text-sm font-bold text-primary">Guardar</Text>
              </Pressable>
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
