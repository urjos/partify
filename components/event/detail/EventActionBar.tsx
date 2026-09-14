import { icons } from "@/constants/icons";
import React from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface EventActionBarProps {
  isOwner: boolean;
  status: AttendanceStatus;
  contactMethod?: "chat" | "external";
  externalTicketUrl?: string;
  contactPhone?: string;
  eventTitle: string;
  onToggleStatus: (next: Exclude<AttendanceStatus, null>) => void;
  onContactWhatsApp: () => void;
  onEditPress: () => void;
  onCancelPress: () => void;
}

export default function EventActionBar({
  isOwner,
  status,
  contactMethod,
  externalTicketUrl,
  contactPhone,
  eventTitle,
  onToggleStatus,
  onContactWhatsApp,
  onEditPress,
  onCancelPress,
}: EventActionBarProps) {
  const isExternal = contactMethod === "external" && Boolean(externalTicketUrl);

  const handleContactPress = () => {
    if (isExternal) {
      Linking.openURL(externalTicketUrl!).catch(() => {});
    } else {
      onContactWhatsApp();
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} className="bg-background">
      <View className="px-4 py-3">
        {isOwner ? (
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={onEditPress}
              className="flex-1 bg-modal-background py-3.5 rounded-2xl items-center justify-center active:opacity-75"
            >
              <Text className="text-sm font-bold text-primary">
                Editar evento
              </Text>
            </Pressable>

            <Pressable
              onPress={onCancelPress}
              className="flex-1 bg-modal-background py-3.5 rounded-2xl items-center justify-center active:opacity-75"
            >
              <Text className="text-sm font-bold text-delete">
                Cancelar evento
              </Text>
            </Pressable>
          </View>
        ) : (
          <View className="flex-row items-center gap-3">
            {/* Segmented Control de RSVP */}
            <View className="flex-1 flex-row bg-modal-background rounded-2xl p-1">
              {/* Botón Asistiré (I'm going) */}
              <Pressable
                onPress={() => onToggleStatus("going")}
                className={`flex-1 py-3 rounded-xl items-center justify-center transition-all ${
                  status === "going"
                    ? "bg-chip-background"
                    : "active:bg-accent-icon/10"
                }`}
              >
                <Text
                  className={`text-xs font-bold tracking-wide ${
                    status === "going"
                      ? "text-accent-pink"
                      : "text-muted-foreground"
                  }`}
                >
                  Asistiré
                </Text>
              </Pressable>

              {/* Botón Me interesa (Interested) */}
              <Pressable
                onPress={() => onToggleStatus("interested")}
                className={`flex-1 py-3 rounded-xl items-center justify-center transition-all ${
                  status === "interested"
                    ? "bg-chip-background"
                    : "active:bg-accent-icon/10"
                }`}
              >
                <Text
                  className={`text-xs font-bold tracking-wide ${
                    status === "interested"
                      ? "text-accent-pink"
                      : "text-muted-foreground"
                  }`}
                >
                  Me interesa
                </Text>
              </Pressable>
            </View>

            {/* Botón de Contacto / Ticket */}
            <Pressable
              onPress={handleContactPress}
              className={`size-13 rounded-2xl items-center justify-center active:opacity-85 ${
                isExternal ? "bg-accent-pink" : "bg-[#25D366]"
              }`}
              hitSlop={6}
            >
              <Image
                source={isExternal ? icons.ticket : icons.whatsapp}
                className="size-6"
                resizeMode="contain"
                tintColor="#ffffff"
              />
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
