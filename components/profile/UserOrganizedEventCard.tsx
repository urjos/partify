import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

export interface UserOrganizedEventCardProps {
  id: string;
  title: string;
  location: string;
  dateBadge?: string;
  priceLabel?: string;
  image?: ImageSourcePropType | { uri: string };
  isOwner?: boolean;
  onPressDetails: () => void;
  onPressContact?: () => void;
}

export default function UserOrganizedEventCard({
  title,
  location,
  dateBadge = "HOY · 20:00",
  priceLabel,
  image,
  isOwner = true,
  onPressDetails,
  onPressContact,
}: UserOrganizedEventCardProps) {
  const resolvedImage = image || images.noriel;

  return (
    <View className="bg-modal-background rounded-3xl gap-2 border border-border/20 overflow-hidden mb-4">
      {/* Contenedor de Imagen y Badges */}
      <View className="relative w-full h-66 rounded-2xl overflow-hidden">
        <Image
          source={resolvedImage}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Badges superiores: Horario y Precio */}
        <View className="absolute top-3 left-3 right-3 flex-row items-center justify-between">
          <View className="bg-subchip-background px-3 py-1 rounded-2xl shadow-sm">
            <Text className="text-xs font-bold text-primary ">{dateBadge}</Text>
          </View>

          {priceLabel ? (
            <View className="bg-subchip-background px-3 py-1 rounded-2xl ">
              <Text className="text-xs font-extrabold text-money">
                {priceLabel}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Info: Título y Ubicación */}
      <View className="p-4 gap-1">
        <Text className="text-lg font-extrabold text-primary" numberOfLines={1}>
          {title}
        </Text>

        <View className="flex-row items-center gap-1.5">
          <Image
            source={icons.mapPin}
            className="size-3.5"
            tintColor={colors.mutedForeground}
          />
          <Text
            className="text-xs font-medium text-muted-foreground flex-1"
            numberOfLines={1}
          >
            {location}
          </Text>
        </View>
      </View>

      {/* Fila de Botones de Acción */}
      <View className="flex-row items-center gap-2.5 px-3">
        <Pressable
          onPress={onPressDetails}
          className="flex-1 bg-accent py-3 px-4 rounded-2xl flex-row items-center justify-center gap-1 active:opacity-75"
        >
          <Text className="text-sm font-bold text-primary">Ver Evento</Text>
        </Pressable>

        {onPressContact ? (
          <Pressable
            onPress={onPressContact}
            className="bg-submodal-background py-3 px-4 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-75"
          >
            <Image
              source={icons.messageSquareText}
              className="size-4"
              tintColor={colors.primary}
            />
            <Text className="text-sm font-semibold text-primary">
              Contactar
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
