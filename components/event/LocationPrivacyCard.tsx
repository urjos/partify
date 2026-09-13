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
    <View className="gap-4">
      <View className="bg-card rounded-2xl border-none gap-2">
        {/* Campo Dirección o Referencia */}
        <View>
          <Pressable
            onPress={() => router.push("/create-location")}
            className="flex-row items-center bg-card border-none active:opacity-80"
          >
            <View className="h-45 w-full relative">
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
                    <View className="size-7 rounded-full bg-card items-center justify-center shadow-lg">
                      <Ionicons
                        name="location"
                        size={14}
                        color={colors.destructive}
                      />
                    </View>
                  </Marker>
                ) : null}
              </MapView>
            </View>
          </Pressable>
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
