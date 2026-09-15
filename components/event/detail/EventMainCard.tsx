import EventRatingStars from "@/components/event/detail/EventRatingStars";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import dayjs from "dayjs";
import "dayjs/locale/es";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

dayjs.locale("es");

interface EventMainCardProps {
  title: string;
  price?: number;
  priceWomen?: number;
  isFreeEvent?: boolean;
  isMultiplePrices?: boolean;
  typeMusic?: string;
  startAt?: string;
  closingAt?: string;
  location: string;
  distanceLabel?: string;
  capacity?: number;
  attendeeCount: number;
  interestedCount: number;
  rating: number;
  ratingsCount?: number;
  userRating?: number | null;
  hideExactAddress?: boolean;
  onRate: (score: number) => void;
  onLocationPress?: () => void;
}

export default function EventMainCard({
  title,
  price,
  priceWomen,
  isFreeEvent,
  isMultiplePrices,
  typeMusic,
  startAt,
  closingAt,
  location,
  distanceLabel,
  capacity,
  attendeeCount,
  interestedCount,
  rating,
  ratingsCount = 0,
  userRating,
  hideExactAddress = false,
  onRate,
  onLocationPress,
}: EventMainCardProps) {
  // Formateo de fecha y hora
  const startDate = startAt ? dayjs(startAt).locale("es") : dayjs();
  const dateFormatted =
    startDate.format("ddd D [de] MMMM").charAt(0).toUpperCase() +
    startDate.format("ddd D [de] MMMM").slice(1);

  const startTimeStr = startDate.format("hh:mm a");
  const endTimeStr = closingAt
    ? dayjs(closingAt).locale("es").format("hh:mm a")
    : null;
  const timeLabel = endTimeStr
    ? `${startTimeStr} - ${endTimeStr}`
    : startTimeStr;

  // Formateo de precio para el badge superior
  let priceBadgeText = "Gratis";
  if (!isFreeEvent) {
    if (isMultiplePrices) {
      priceBadgeText = "Varios precios";
    } else if (price && priceWomen && price !== priceWomen) {
      priceBadgeText = `H: S/ ${price} · M: S/ ${priceWomen}`;
    } else if (price != null && price > 0) {
      priceBadgeText = `S/ ${price.toFixed(2)}`;
    } else if (priceWomen != null && priceWomen > 0) {
      priceBadgeText = `S/ ${priceWomen.toFixed(2)}`;
    }
  }

  // Capacidad y progreso
  const maxCap = capacity && capacity > 0 ? capacity : 40;
  const currentOccupancy = attendeeCount;
  const percentage = Math.min(
    100,
    Math.round((currentOccupancy / maxCap) * 100),
  );
  const remainingSlots = Math.max(0, maxCap - currentOccupancy);

  return (
    <View className="bg-modal-background rounded-3xl p-5 gap-3">
      {/* 1. Fila de Badges: Precio y Género musical */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className="w-full"
      >
        <View className="flex-row flex-wrap items-center gap-2">
          {/* Badge de Precio */}
          <View className="bg-chip-background px-3.5 py-1.5 rounded-full">
            <Text className="text-sm font-extrabold text-accent-pink">
              {priceBadgeText}
            </Text>
          </View>

          {/* Badge de Género Musical */}
          {typeMusic ? (
            <View className="bg-subchip-background px-3.5 py-1.5 rounded-full flex-row items-center gap-1.5">
              <Image
                source={icons.audioLines}
                className="size-4"
                tintColor={colors.accent}
              />
              <Text
                className="text-xs font-semibold text-accent"
                numberOfLines={1}
              >
                {typeMusic}
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* 2. Título del evento y Rating promedio */}
      <View className="flex-row items-start justify-between gap-3">
        <Text className="text-3xl font-extrabold text-primary flex-1">
          {title}
        </Text>
        {rating > 0 ? (
          <View className="flex-row items-center bg-chip-background px-2.5 py-1 rounded-xl gap-1 mt-0.5">
            <Text className="text-sm font-bold text-accent-pink">
              {rating.toFixed(1)}
            </Text>
            <Image
              source={icons.star}
              className="size-3"
              tintColor={colors.accentPink}
            />
          </View>
        ) : null}
      </View>

      <View className="gap-3.5">
        {/* 3. Fila de Fecha y Horarios */}
        <View className="flex-row items-center gap-2">
          <View className="size-10 rounded-2xl items-center justify-center">
            <Image
              source={icons.calendar}
              className="size-5"
              tintColor={colors.mutedForeground}
              resizeMode="contain"
            />
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-sm font-bold text-primary">
              {dateFormatted}
            </Text>
            <Text className="text-xs font-medium text-muted-foreground">
              {timeLabel}
            </Text>
          </View>
        </View>

        {/* 4. Fila de Ubicación & Distancia */}
        {!hideExactAddress ? (
          <Pressable
            onPress={onLocationPress}
            className="flex-row items-center gap-2 active:opacity-75"
          >
            <View className="size-10 rounded-2xl items-center justify-center">
              <Image
                source={icons.navigation}
                className="size-5"
                tintColor={colors.mutedForeground}
                resizeMode="contain"
              />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-sm font-bold text-primary" numberOfLines={1}>
                {location}
              </Text>
              <Text className="text-xs font-medium text-muted-foreground">
                {distanceLabel || "Toca para abrir en el mapa"}
              </Text>
            </View>
          </Pressable>
        ) : null}
      </View>

      {/* 5. Barra de Aforo y Demanda */}
      <View className="rounded-2xl p-3.5 gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-bold text-primary">
            {currentOccupancy}/{maxCap}
          </Text>
          {remainingSlots <= 15 ? (
            <Text className="text-xs font-extrabold text-accent-pink tracking-wide">
              {remainingSlots > 0
                ? `¡Últimos ${remainingSlots} cupos!`
                : "¡Cupos agotados!"}
            </Text>
          ) : (
            <Text className="text-xs font-semibold text-muted-foreground">
              {remainingSlots} cupos libres
            </Text>
          )}
        </View>

        {/* Barra de progreso */}
        <View className="h-2 w-full bg-card rounded-full overflow-hidden">
          <View
            className="h-full bg-accent-pink rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </View>

        <View className="flex-row items-center justify-end">
          <Text className="text-[11px] font-regular text-muted-foreground">
            {interestedCount} personas interesadas
          </Text>
        </View>
      </View>

      {/* 6. Barra de Calificación Interactiva de 5 Estrellas */}
      <EventRatingStars
        userRating={userRating}
        averageRating={rating}
        ratingsCount={ratingsCount}
        onRate={onRate}
      />
    </View>
  );
}
