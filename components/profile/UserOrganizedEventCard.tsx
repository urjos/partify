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
  priceLabel = "S/ 45",
  image,
  isOwner = true,
  onPressDetails,
  onPressContact,
}: UserOrganizedEventCardProps) {
  const resolvedImage = image || images.noriel;

  return (
    <View className="bg-modal-background rounded-3xl p-3.5 gap-3 border border-border/20 overflow-hidden mb-4">
      {/* Contenedor de Imagen y Badges */}
      <View className="relative w-full h-44 rounded-2xl overflow-hidden">
        <Image
          source={resolvedImage}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Badges superiores: Horario y Precio */}
        <View className="absolute top-3 left-3 right-3 flex-row items-center justify-between">
          <View className="bg-accent-pink px-3 py-1 rounded-full shadow-sm">
            <Text className="text-xs font-extrabold text-white uppercase tracking-wider">
              {dateBadge}
            </Text>
          </View>

          {priceLabel ? (
            <View className="bg-black/70 px-3 py-1 rounded-full border border-white/10">
              <Text className="text-xs font-bold text-white">{priceLabel}</Text>
            </View>
          ) : null}
        </View>

        {/* Badge inferior: Anfitrión de este evento */}
        {isOwner && (
          <View className="absolute bottom-3 left-3 bg-black/65 px-3 py-1 rounded-full flex-row items-center gap-1.5 border border-white/10 backdrop-blur-sm">
            <Image
              source={icons.star}
              className="size-3"
              tintColor={colors.accentPink}
            />
            <Text className="text-xs font-semibold text-white">
              Anfitrión de este evento
            </Text>
          </View>
        )}
      </View>

      {/* Info: Título y Ubicación */}
      <View className="px-1 gap-1">
        <Text
          className="text-lg font-extrabold text-primary"
          numberOfLines={1}
        >
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
      <View className="flex-row items-center gap-2.5 pt-1">
        <Pressable
          onPress={onPressDetails}
          className="flex-1 bg-[#3a284c] py-3 px-4 rounded-2xl flex-row items-center justify-center gap-1 active:opacity-75"
        >
          <Text className="text-sm font-bold text-primary">Ver Evento</Text>
          <Text className="text-sm font-bold text-accent-pink ml-0.5">›</Text>
        </Pressable>

        {onPressContact ? (
          <Pressable
            onPress={onPressContact}
            className="bg-[#1c1825] border border-border/40 py-3 px-4 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-75"
          >
            <Image
              source={icons.messageSquareText}
              className="size-4"
              tintColor={colors.primary}
            />
            <Text className="text-sm font-semibold text-primary">
              Contactar Host
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
