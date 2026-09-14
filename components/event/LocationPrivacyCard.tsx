import AnimatedToggle from "@/components/shared/AnimatedToggle";
import { darkMapStyle } from "@/constants/mapStyle";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import MapView from "react-native-maps";

interface LocationPrivacyCardProps {
  location: {
    address: string;
    latitude: number;
    longitude: number;
  } | null;
  hideExactAddress: boolean;
  onHideExactAddressChange: (hide: boolean) => void;
}

export default function LocationPrivacyCard({
  location,
  hideExactAddress,
  onHideExactAddressChange,
}: LocationPrivacyCardProps) {
  const latitude = location?.latitude || -12.0464;
  const longitude = location?.longitude || -77.0428;

  return (
    <View className="gap-4">
      <View className="gap-2">
        {/* Campo Dirección o Referencia */}
        <View className="gap-1">
          <Pressable
            onPress={() => router.push("/create-location")}
            className="h-44 w-full relative overflow-hidden rounded-2xl active:opacity-80"
          >
            <MapView
              style={{ width: "100%", height: "100%" }}
              region={{
                latitude,
                longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              customMapStyle={darkMapStyle}
              userInterfaceStyle="dark"
              pointerEvents="none"
            />

            {/* Pin central fijo (evita parpadeo) */}
            {location ? (
              <View
                className="absolute inset-0 items-center justify-center"
                pointerEvents="none"
              >
                <View className="size-8 rounded-full bg-card items-center justify-center shadow-lg border border-border/40">
                  <Ionicons
                    name="location"
                    size={16}
                    color={colors.destructive}
                  />
                </View>
              </View>
            ) : null}
          </Pressable>
          <Text className="font-regular text-muted-foreground text-xs">
            Selecciona en el mapa.
          </Text>
        </View>

        {/* Mini Mapa Preview con botón "Fijar punto GPS exacto" */}

        {/* Toggle Ocultar dirección exacta */}
        <View className="flex-row items-center justify-between p-3">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-primary">
              Ocultar dirección exacta
            </Text>
            <Text className="text-xs text-muted-foreground">
              Solo visible tras confirmar la compra del ticket
            </Text>
          </View>
          <AnimatedToggle
            value={hideExactAddress}
            onValueChange={onHideExactAddressChange}
          />
        </View>
      </View>
    </View>
  );
}
