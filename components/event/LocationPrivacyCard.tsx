import AnimatedToggle from "@/components/AnimatedToggle";
import { darkMapStyle } from "@/constants/mapStyle";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

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
    <View className="mt-5">
      <Text className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-3">
        Ubicación y Privacidad
      </Text>

      <View className="bg-card rounded-2xl p-4 border border-border gap-4">
        {/* Campo Dirección o Referencia */}
        <View>
          <Text className="text-xs font-semibold text-muted-foreground mb-1.5">
            Dirección o Referencia
          </Text>
          <Pressable
            onPress={() => router.push("/create-location")}
            className="flex-row items-center bg-modal-background p-3 rounded-xl border border-border active:opacity-80"
          >
            <Ionicons
              name="location"
              size={18}
              color={colors.accentPink}
              style={{ marginRight: 8 }}
            />
            <Text
              className={
                location
                  ? "flex-1 text-sm font-semibold text-primary"
                  : "flex-1 text-sm font-medium text-muted-foreground"
              }
              numberOfLines={1}
            >
              {location?.address || "Selecciona una ubicación en el mapa"}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.mutedForeground}
            />
          </Pressable>
        </View>

        {/* Mini Mapa Preview con botón "Fijar punto GPS exacto" */}
        <View className="h-32 rounded-xl overflow-hidden border border-border relative">
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
          >
            {location ? (
              <Marker coordinate={{ latitude, longitude }}>
                <View className="size-7 rounded-full bg-accent-pink items-center justify-center shadow-lg border-2 border-white">
                  <Ionicons name="location" size={14} color="#ffffff" />
                </View>
              </Marker>
            ) : null}
          </MapView>

          {/* Overlay botón para fijar punto GPS exacto */}
          <Pressable
            onPress={() => router.push("/create-location")}
            className="absolute bottom-2.5 self-center flex-row items-center bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-border active:opacity-80"
          >
            <Ionicons
              name="navigate"
              size={12}
              color={colors.accentPink}
              style={{ marginRight: 5 }}
            />
            <Text className="text-xs font-semibold text-primary">
              Fijar punto GPS exacto
            </Text>
          </Pressable>
        </View>

        {/* Toggle Ocultar dirección exacta */}
        <View className="flex-row items-center justify-between pt-3 border-t border-border/50">
          <View className="flex-1 pr-4">
            <Text className="text-sm font-semibold text-primary">
              Ocultar dirección exacta
            </Text>
            <Text className="text-xs text-muted-foreground mt-0.5">
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
