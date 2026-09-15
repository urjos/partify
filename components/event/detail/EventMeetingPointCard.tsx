import { icons } from "@/constants/icons";
import { darkMapStyle } from "@/constants/mapStyle";
import { colors } from "@/constants/theme";
import { openWhatsApp } from "@/lib/whatsapp";
import React from "react";
import { Image, Linking, Platform, Pressable, Text, View } from "react-native";
import MapView from "react-native-maps";

interface EventMeetingPointCardProps {
  location: string;
  latitude?: number;
  longitude?: number;
  hideExactAddress?: boolean;
  contactMethod?: "chat" | "external";
  contactPhone?: string;
  externalTicketUrl?: string;
  eventTitle?: string;
  onContactPress?: () => void;
}

export default function EventMeetingPointCard({
  location,
  latitude = -12.0464,
  longitude = -77.0428,
  hideExactAddress = false,
  contactMethod,
  contactPhone,
  externalTicketUrl,
  eventTitle,
  onContactPress,
}: EventMeetingPointCardProps) {
  const isExternal = contactMethod === "external" && Boolean(externalTicketUrl);

  const handleContact = () => {
    if (onContactPress) {
      onContactPress();
    } else if (isExternal && externalTicketUrl) {
      Linking.openURL(externalTicketUrl).catch(() => {});
    } else {
      openWhatsApp(contactPhone, eventTitle || "Evento");
    }
  };

  if (hideExactAddress) {
    return (
      <View className="bg-modal-background rounded-3xl p-5 gap-3.5">
        <Text className="text-lg font-bold text-primary">
          Punto de encuentro
        </Text>

        <View className="bg-modal-background rounded-2xl p-4 gap-3 border border-border">
          <View className="flex-row items-center gap-2.5">
            <View className="flex-1">
              <Text className="text-sm font-bold text-primary">
                Ubicación reservada
              </Text>
            </View>
          </View>

          <Text className="text-xs font-medium text-muted-foreground leading-relaxed">
            La dirección exacta se proporcionará directamente a través del medio
            de contacto con el anfitrión.
          </Text>

          <Pressable
            onPress={handleContact}
            className="w-full bg-modal-background border border-border py-3 rounded-xl flex-row items-center justify-center gap-2 active:opacity-75 mt-1"
          >
            <Image
              source={isExternal ? icons.ticket : icons.whatsapp}
              className="size-4"
              tintColor={isExternal ? colors.primary : "#25D366"}
              resizeMode="contain"
            />
            <Text className="text-xs font-bold text-primary">
              {isExternal
                ? "Ver detalles en plataforma de tickets"
                : "Solicitar ubicación al anfitrión"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }
  const openUber = () => {
    const uberUrl = `uber://?action=setPickup&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}&dropoff[formatted_address]=${encodeURIComponent(location)}`;
    const webFallback = `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${latitude}&dropoff[longitude]=${longitude}`;
    Linking.openURL(uberUrl).catch(() =>
      Linking.openURL(webFallback).catch(() => {}),
    );
  };

  const openWaze = () => {
    const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`;
    const webFallback = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    Linking.openURL(wazeUrl).catch(() =>
      Linking.openURL(webFallback).catch(() => {}),
    );
  };

  const openMaps = () => {
    const query = encodeURIComponent(location);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://maps.google.com/?q=${query}`,
    });
    if (url) Linking.openURL(url).catch(() => {});
  };

  return (
    <View className="bg-modal-background rounded-3xl p-5 gap-4">
      <Text className="text-lg font-bold text-primary">Punto de encuentro</Text>

      {/* Vista previa del Mapa con Pill superpuesta */}
      <Pressable
        onPress={openMaps}
        className="h-44 w-full rounded-2xl overflow-hidden relative active:opacity-90"
      >
        <MapView
          style={{ width: "100%", height: "100%" }}
          region={{
            latitude,
            longitude,
            latitudeDelta: 0.012,
            longitudeDelta: 0.012,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          customMapStyle={darkMapStyle}
          userInterfaceStyle="dark"
          pointerEvents="none"
        />

        {/* Pin central fijo (evita parpadeo y saltos de render en react-native-maps) */}
        <View
          className="absolute inset-0 items-center justify-center"
          pointerEvents="none"
        >
          <View className="size-8 rounded-full bg-card items-center justify-center shadow-lg border border-border/40">
            <Image
              source={icons.mapPin}
              className="size-4"
              tintColor={colors.destructive}
            />
          </View>
        </View>

        {/* Overlay Pill inferior con la dirección */}
        <View className="absolute bottom-2.5 left-2.5 right-2.5 bg-card/95 px-3.5 py-2 rounded-xl flex-row items-center justify-between backdrop-blur-md">
          <View className="flex-row items-center gap-2 flex-1 pr-2">
            <Text
              className="text-xs font-regular text-primary flex-1"
              numberOfLines={1}
            >
              {location}
            </Text>
          </View>
          <Text className="text-xs font-bold text-muted-foreground">
            Ver mapa
          </Text>
        </View>
      </Pressable>

      {/* Botones de Movilidad: Pedir Uber & Abrir en Waze */}
      <View className="flex-row gap-3">
        {/* Botón Uber */}
        <Pressable
          onPress={openUber}
          className="flex-1 bg-modal-background border border-border/60 py-3 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-75"
        >
          <Image
            source={icons.carFront}
            className="size-5"
            tintColor={colors.primary}
          />
          <Text className="text-xs font-bold text-primary">Pedir Uber</Text>
        </Pressable>

        {/* Botón Waze */}
        <Pressable
          onPress={openWaze}
          className="flex-1 bg-modal-background border border-border/60 py-3 rounded-2xl flex-row items-center justify-center gap-2 active:opacity-75"
        >
          <Image
            source={icons.navigation}
            className="size-4"
            tintColor={colors.primary}
          />
          <Text className="text-xs font-bold text-primary">Abrir en Waze</Text>
        </Pressable>
      </View>
    </View>
  );
}
