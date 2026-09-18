import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { formatPeruPhone, getPeruPhoneValidationMessage } from "@/lib/utils";
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

  const phoneError = getPeruPhoneValidationMessage(tempPhone);
  const isPhoneValid =
    tempPhone.replace(/\D/g, "").length === 9 && !phoneError;

  const phoneBorderClass = phoneError
    ? "border-delete"
    : isPhoneValid
      ? "border-success"
      : "border-border/40";

  const openPhoneModal = () => {
    setEditingPhone(true);
    setTempPhone(phone ? formatPeruPhone(phone) : "");
  };

  const handlePhoneInputChange = (text: string) => {
    const formatted = formatPeruPhone(text);
    setTempPhone(formatted);
  };

  const handleSavePhone = () => {
    if (tempPhone.trim() && phoneError) return;
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
                {phone ? formatPeruPhone(phone) : "No configurado"}
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
              Ingresa tu número de WhatsApp para coordinar transferencias o
              entradas directas.
            </Text>

            <View className="gap-1.5">
              <View
                className={`flex-row items-center bg-card rounded-2xl px-3.5 py-2.5 border ${phoneBorderClass}`}
              >
                <Text className="text-sm font-semibold text-muted-foreground mr-2">
                  🇵🇪 +51
                </Text>
                <TextInput
                  className="flex-1 text-sm font-semibold text-primary"
                  value={tempPhone}
                  onChangeText={handlePhoneInputChange}
                  placeholder="987 654 321"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="phone-pad"
                  maxLength={11}
                  autoFocus
                />
              </View>
              <FormErrorMessage message={phoneError} />
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
                disabled={Boolean(tempPhone.trim() && phoneError)}
                className={`flex-1 items-center justify-center py-3 rounded-2xl ${
                  tempPhone.trim() && phoneError
                    ? "bg-accent-pink/40"
                    : "bg-accent-pink active:opacity-85"
                }`}
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
