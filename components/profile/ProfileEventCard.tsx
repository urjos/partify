import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
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
      className="bg-card/60 rounded-2xl p-4 border.none gap-5 active:opacity-90"
    >
      {/* Información principal del evento */}
      <View className="flex-row items-center gap-3">
        <Image
          source={item.image}
          className="size-18 rounded-xl bg-muted"
          resizeMode="cover"
        />

        <View className="flex-1 justify-center">
          {/* Badge de Fecha / Hora */}
          <View className="self-start">
            <Text className="text-sm font-bold text-muted-foreground">
              {item.dateBadge}
            </Text>
          </View>

          {/* Título */}
          <Text
            numberOfLines={1}
            className="text-sm font-sans-bold text-primary mt-1"
          >
            {item.title}
          </Text>

          {/* Dirección */}
          <Text
            numberOfLines={1}
            className="text-xs font-sans-medium text-muted-foreground mt-0.5"
          >
            {item.location}
          </Text>
        </View>
      </View>

      {/* Barra de acción inferior */}
      <View className="flex-row items-center justify-between ">
        {/* Estado del ticket / reserva */}
        <View className="flex-row items-center gap-1.5">
          {item.status === "approved" ? (
            <Image
              source={icons.qrCode}
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
          <Text className="text-xs font-sans-semibold text-primary">
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
          <Text className="text-xs font-sans-bold text-primary">Contactar</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
