import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { locationFormattedDistrictAndAddress } from "@/lib/utils";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

export interface ProfileEventItem {
  id: string;
  title: string;
  location: string;
  dateBadge: string;
  image: ImageSourcePropType | { uri: string };
  status: "approved" | "confirmed";
  statusLabel: string;
  contactPhone?: string;
  externalTicketUrl?: string;
  contactMethod?: "chat" | "external";
}

interface ProfileEventCardProps {
  item: ProfileEventItem;
  onPress?: () => void;
  onContact?: () => void;
}

export default function ProfileEventCard({
  item,
  onPress,
  onContact,
}: ProfileEventCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-modal-background rounded-2xl flex-row p-3 border.none gap-3 active:opacity-90"
    >
      <View className="h-full">
        <Image
          source={item.image}
          className="size-20  overflow-hidden"
          resizeMode="contain"
        />
      </View>
      {/* Información principal del evento */}
      <View className="flex-1 gap-3">
        <View>
          {/* Badge de Fecha / Hora */}
          <View className="self-start">
            <Text className="text-sm font-medium text-muted-foreground">
              {item.dateBadge}
            </Text>
          </View>

          {/* Título */}
          <Text numberOfLines={1} className="text-sm font-bold text-primary">
            {item.title}
          </Text>

          {/* Dirección */}
          <Text
            numberOfLines={1}
            className="text-xs font-medium text-muted-foreground"
          >
            {locationFormattedDistrictAndAddress(item.location)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between ">
          {/* Estado del ticket / reserva */}
          <View className="flex-row items-center gap-1.5">
            {item.status === "approved" ? (
              <Image
                source={icons.ticket}
                className="size-4"
                tintColor={colors.accentPink}
              />
            ) : (
              <Image
                source={icons.checkCircle}
                className="size-4"
                tintColor={colors.accentPink}
              />
            )}
            <Text className="text-xs font-medium text-accent-pink/80">
              {item.statusLabel}
            </Text>
          </View>

          {/* Botón Contactar */}
          <Pressable
            onPress={onContact}
            hitSlop={6}
            className="flex-row items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-xl active:opacity-75"
          >
            <Image
              source={icons.messageSquareText}
              className="size-4"
              tintColor={colors.primary}
            />
            <Text className="text-xs font-bold text-primary">Contactar</Text>
          </Pressable>
        </View>
      </View>

      {/* Barra de acción inferior */}
    </Pressable>
  );
}
