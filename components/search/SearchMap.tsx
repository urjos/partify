import { icons } from "@/constants/icons";
import { darkMapStyle } from "@/constants/mapStyle";
import { colors } from "@/constants/theme";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, Easing, Image, View } from "react-native";
import MapView, { Circle, Marker, Region } from "react-native-maps";

interface SearchMapProps {
  events: any[]; // Or EventItem[] if imported
  onEventPress?: (event: any) => void;
  radiusKm?: number;
  userLocation?: { latitude: number; longitude: number } | null;
  onLocationReady?: (coords: { latitude: number; longitude: number }) => void;
}

// Un delta pequeño significa que el mapa está "acercado" (zoomed in).
const ZOOM_THRESHOLD = 0.05;

export default function SearchMap({
  events,
  onEventPress,
  radiusKm,
  userLocation,
  onLocationReady,
}: SearchMapProps) {
  const [location, setLocation] = useState<Region | null>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const spinValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        const fallback = {
          latitude: -12.0464,
          longitude: -77.0428,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setLocation(fallback);
        onLocationReady?.({
          latitude: fallback.latitude,
          longitude: fallback.longitude,
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
        onLocationReady?.({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        const fallback = {
          latitude: -12.0464,
          longitude: -77.0428,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setLocation(fallback);
        onLocationReady?.({
          latitude: fallback.latitude,
          longitude: fallback.longitude,
        });
      }
    })();
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue, onLocationReady]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleRegionChangeComplete = (region: Region) => {
    setIsZoomedIn(region.latitudeDelta < ZOOM_THRESHOLD);
  };

  if (!location) {
    return (
      <View className="search-map-container-loading">
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Image
            source={icons.loader}
            className="size-10"
            tintColor={colors.primary}
          />
        </Animated.View>
      </View>
    );
  }

  const centerCoords =
    userLocation ??
    (location
      ? { latitude: location.latitude, longitude: location.longitude }
      : null);

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
        {centerCoords && !!radiusKm && (
          <Circle
            center={centerCoords}
            radius={radiusKm * 1000}
            strokeWidth={1.5}
            strokeColor={colors.accentPink}
            fillColor="rgba(234, 75, 200, 0.12)"
          />
        )}
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
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}
