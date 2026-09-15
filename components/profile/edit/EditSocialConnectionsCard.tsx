import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { UserSocials } from "@/lib/store/userStore";
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

interface EditSocialConnectionsCardProps {
  socials: UserSocials;
  onLinkSocial: (network: keyof UserSocials, handle: string) => void;
  onUnlinkSocial: (network: keyof UserSocials) => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
}

export default function EditSocialConnectionsCard({
  socials,
  onLinkSocial,
  onUnlinkSocial,
  phone,
  onPhoneChange,
}: EditSocialConnectionsCardProps) {
  // Modal state for linking/editing social or phone
  const [activeNetwork, setActiveNetwork] = useState<keyof UserSocials | null>(
    null,
  );
  const [editingPhone, setEditingPhone] = useState(false);
  const [tempHandle, setTempHandle] = useState("");
  const [tempPhone, setTempPhone] = useState("");

  const openSocialModal = (network: keyof UserSocials) => {
    setActiveNetwork(network);
    setTempHandle(socials[network] || "");
  };

  const handleSaveSocial = () => {
    if (activeNetwork) {
      const clean = tempHandle.replace(/^@/, "").trim();
      if (clean) {
        onLinkSocial(activeNetwork, clean);
      } else {
        onUnlinkSocial(activeNetwork);
      }
      setActiveNetwork(null);
    }
  };

  const openPhoneModal = () => {
    setEditingPhone(true);
    setTempPhone(phone || "");
  };

  const handleSavePhone = () => {
    onPhoneChange(tempPhone.trim());
    setEditingPhone(false);
  };

  const networkConfig: Record<
    keyof UserSocials,
    { label: string; icon: any; placeholder: string; prefix: string }
  > = {
    instagram: {
      label: "Instagram",
      icon: icons.instagram,
      placeholder: "tu.usuario",
      prefix: "instagram.com/",
    },

    tiktok: {
      label: "TikTok",
      icon: icons.tiktok,
      placeholder: "tu.usuario",
      prefix: "tiktok.com/@",
    },
  };

  return (
    <View className="gap-2">
      <Text className="text-lg font-bold text-primary">Conexiones</Text>

      <View className="bg-modal-background rounded-3xl p-4 gap-4">
        {(Object.keys(networkConfig) as Array<keyof UserSocials>).map(
          (netKey, index) => {
            const config = networkConfig[netKey];
            const isLinked = Boolean(socials[netKey]?.trim());
            const handleText = isLinked
              ? `@${socials[netKey]}`
              : "No vinculado";

            return (
              <View key={netKey}>
                <Pressable
                  onPress={() => openSocialModal(netKey)}
                  className="flex-row items-center justify-between py-1 active:opacity-75"
                >
                  <View className="flex-row items-center gap-2 flex-1">
                    <Image
                      source={config.icon}
                      className="size-6"
                      resizeMode="contain"
                      tintColor={colors.mutedForeground}
                    />
                    <View className="flex-1">
                      <Text className="text-xs font-semibold text-muted-foreground">
                        {config.label}
                      </Text>
                      <Text
                        numberOfLines={1}
                        className={`text-sm font-medium ${
                          isLinked ? "text-primary" : "text-muted-foreground/60"
                        }`}
                      >
                        {handleText}
                      </Text>
                    </View>
                  </View>
                  {isLinked && (
                    <View className="flex-row items-center gap-1 bg-success/15 px-2 py-1 rounded-full">
                      <Image
                        source={icons.link}
                        className="size-4"
                        resizeMode="contain"
                        tintColor={colors.success}
                      />
                      <Text className="text-xs font-semibold text-success">
                        Vinculado
                      </Text>
                    </View>
                  )}
                </Pressable>
              </View>
            );
          },
        )}

        {/* Teléfono */}
        <Pressable
          onPress={openPhoneModal}
          className="flex-row items-center justify-between py-1 active:opacity-75"
        >
          <View className="flex-row items-center gap-2 flex-1">
            <View className="flex-1">
              <Text className="text-xs font-semibold text-muted-foreground">
                Teléfono
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

      {/* Modal para Vincular Red Social */}
      <Modal
        visible={activeNetwork !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveNetwork(null)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          {/* Backdrop con Blur y overlay oscuro transparente */}
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setActiveNetwork(null)}
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

          {activeNetwork && (
            <Pressable
              onPress={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-modal-background rounded-3xl p-5 gap-4 border border-card"
            >
              <View className="flex-row items-center gap-3">
                <Image
                  source={networkConfig[activeNetwork].icon}
                  className="size-6"
                  resizeMode="contain"
                  tintColor={colors.primary}
                />
                <Text className="text-lg font-bold text-primary">
                  {socials[activeNetwork]
                    ? `Gestionar ${networkConfig[activeNetwork].label}`
                    : `Conectar ${networkConfig[activeNetwork].label}`}
                </Text>
              </View>

              <Text className="text-xs text-muted-foreground leading-relaxed">
                {socials[activeNetwork]
                  ? `Tu cuenta @${socials[activeNetwork]} está vinculada a tu perfil de Partify. Puedes desvincularla en cualquier momento.`
                  : `Inicia sesión de forma segura con tu cuenta de ${networkConfig[activeNetwork].label} para mostrar tu perfil verificado en tus eventos.`}
              </Text>

              {socials[activeNetwork] ? (
                <View className="flex-row items-center bg-card rounded-2xl px-4 py-3 gap-2 border border-card">
                  <Image
                    source={icons.link}
                    className="size-4"
                    tintColor={colors.success}
                  />
                  <Text className="text-sm font-bold text-primary">
                    @{socials[activeNetwork]}
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center bg-card rounded-2xl px-3.5 py-2.5 border border-card">
                  <Text className="text-sm font-bold text-accent-pink mr-1">
                    @
                  </Text>
                  <TextInput
                    className="flex-1 text-sm font-semibold text-primary"
                    value={tempHandle}
                    onChangeText={(text) =>
                      setTempHandle(
                        text.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase(),
                      )
                    }
                    placeholder={networkConfig[activeNetwork].placeholder}
                    placeholderTextColor={colors.mutedForeground}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                  />
                </View>
              )}

              <View className="flex-row gap-3 mt-2">
                {socials[activeNetwork] ? (
                  <>
                    <Pressable
                      onPress={() => setActiveNetwork(null)}
                      className="flex-1 items-center justify-center py-3.5 rounded-2xl bg-card active:opacity-75"
                    >
                      <Text className="text-sm font-bold text-muted-foreground">
                        Cerrar
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        onUnlinkSocial(activeNetwork);
                        setActiveNetwork(null);
                      }}
                      className="flex-1 items-center justify-center py-3.5 rounded-2xl bg-delete/15 active:opacity-75"
                    >
                      <Text className="text-sm font-bold text-delete">
                        Desvincular
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable
                      onPress={() => setActiveNetwork(null)}
                      className="flex-1 items-center justify-center py-3.5 rounded-2xl bg-card active:opacity-75"
                    >
                      <Text className="text-sm font-bold text-muted-foreground">
                        Cancelar
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={handleSaveSocial}
                      className="flex-1 items-center justify-center py-3.5 rounded-2xl bg-accent-pink active:opacity-85"
                    >
                      <Text className="text-sm font-bold text-primary">
                        Conectar cuenta
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>
            </Pressable>
          )}
        </View>
      </Modal>

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
          {/* Backdrop con Blur y overlay oscuro transparente */}
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
              Ingresa tu número de contacto para coordinar transferencias o
              entradas directas.
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
