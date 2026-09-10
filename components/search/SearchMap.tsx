import { icons } from "@/constants/icons";
import { darkMapStyle } from "@/constants/mapStyle";
import { colors } from "@/constants/theme";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, Easing, Image, View } from "react-native";
import MapView, { Circle, Marker, Region } from "react-native-maps";

interface SearchMapProps {
  events: any[];
  onEventPress?: (event: any) => void;
  radiusKm?: number;
  userLocation?: { latitude: number; longitude: number } | null;
  onLocationReady?: (coords: { latitude: number; longitude: number }) => void;
}

// Un delta pequeño significa que el mapa está "acercado" (zoomed in).
const ZOOM_THRESHOLD = 0.05;

interface PulsingRadiusCircleProps {
  center: { latitude: number; longitude: number };
  radiusKm: number;
}

const PulsingRadiusCircle = React.memo(function PulsingRadiusCircle({
  center,
  radiusKm,
}: PulsingRadiusCircleProps) {
  const [step, setStep] = useState(0);
  const totalSteps = 48;

  useEffect(() => {
    // Ciclo continuo de ~2.4s (48 pasos de 50ms)
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % totalSteps);
    }, 50);

    return () => clearInterval(interval);
  }, [totalSteps]);

  const maxRadiusMeters = radiusKm * 1000;

  // Onda 1: Expansión de 0 a 100% con desvanecimiento de opacidad
  const progress1 = step / totalSteps;
  const radius1 = Math.max(30, maxRadiusMeters * progress1);
  const opacity1 = (1 - progress1) * 0.45;

  // Onda 2: Desfasada medio ciclo para lograr efecto constante de radar
  const progress2 = ((step + totalSteps / 2) % totalSteps) / totalSteps;
  const radius2 = Math.max(30, maxRadiusMeters * progress2);
  const opacity2 = (1 - progress2) * 0.45;

  return (
    <>
      {/* Perímetro base que define el límite del filtro */}
      <Circle
        center={center}
        radius={maxRadiusMeters}
        strokeWidth={1.5}
        strokeColor="rgba(234, 75, 200, 0.45)"
        fillColor="rgba(234, 75, 200, 0.05)"
      />

      {/* Onda expansiva primaria */}
      <Circle
        center={center}
        radius={radius1}
        strokeWidth={1.2}
        strokeColor={`rgba(234, 75, 200, ${opacity1.toFixed(3)})`}
        fillColor={`rgba(234, 75, 200, ${(opacity1 * 0.25).toFixed(3)})`}
      />

      {/* Onda expansiva secundaria */}
      <Circle
        center={center}
        radius={radius2}
        strokeWidth={1.2}
        strokeColor={`rgba(234, 75, 200, ${opacity2.toFixed(3)})`}
        fillColor={`rgba(234, 75, 200, ${(opacity2 * 0.25).toFixed(3)})`}
      />
    </>
  );
});

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
      <View key="map-loading" className="search-map-container-loading">
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
    <View key="map-ready" className="search-map-container">
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
          <PulsingRadiusCircle
            center={centerCoords}
            radiusKm={radiusKm}
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
