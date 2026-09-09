import { icons } from "@/constants/icons";
import { darkMapStyle } from "@/constants/mapStyle";
import { colors } from "@/constants/theme";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

interface SearchMapProps {
  events: any[]; // Or EventItem[] if imported
  onEventPress?: (event: any) => void;
}

// Un delta pequeño significa que el mapa está "acercado" (zoomed in).
const ZOOM_THRESHOLD = 0.05;

export default function SearchMap({ events, onEventPress }: SearchMapProps) {
  const [location, setLocation] = useState<Region | null>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // Fallback a un centro por defecto (Lima)
        setLocation({
          latitude: -12.0464,
          longitude: -77.0428,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        // Fallback en caso de error de gps
        setLocation({
          latitude: -12.0464,
          longitude: -77.0428,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  const handleRegionChangeComplete = (region: Region) => {
    setIsZoomedIn(region.latitudeDelta < ZOOM_THRESHOLD);
  };

  if (!location) {
    return (
      <View className="search-map-container-loading">
        <Text className="text-muted-foreground font-sans-medium">
          Cargando...
        </Text>
      </View>
    );
  }

  return (
    <View className="search-map-container">
      <MapView
        style={{ flex: 1 }}
        initialRegion={location}
        showsUserLocation={true}
        onRegionChangeComplete={handleRegionChangeComplete}
        userInterfaceStyle="dark"
        customMapStyle={darkMapStyle}
        mapPadding={{ top: 145, right: 8, left: 0, bottom: 100 }}
      >
        {events.map((event) => {
          if (!event.latitude || !event.longitude) return null;

          const timeString = event.startAt
            ? new Date(event.startAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.latitude,
                longitude: event.longitude,
              }}
              onCalloutPress={() => {
                if (onEventPress) onEventPress(event);
                else router.push(`/(events)/${event.id}`);
              }}
              onPress={() => {
                if (onEventPress) onEventPress(event);
                else router.push(`/(events)/${event.id}`);
              }}
            >
              <View className="search-map-marker">
                <View className="search-map-marker-icon-wrap">
                  <Image
                    source={icons.flame}
                    className="size-4"
                    tintColor={colors.accentPink}
                    resizeMode="contain"
                  />
                </View>

                {isZoomedIn && (
                  <View className="search-map-marker-details">
                    <Text className="search-map-marker-title" numberOfLines={1}>
                      {event.title}
                    </Text>
                    <Text className="search-map-marker-meta">
                      {event.isFreeEvent
                        ? "Gratis"
                        : event.price
                          ? `S/ ${event.price}`
                          : timeString}
                    </Text>
                  </View>
                )}
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}
