import LocationButton from "@/components/search/map/LocationButton";
import PinMap from "@/components/search/map/PinMap";
import { icons } from "@/constants/icons";
import { darkMapStyle } from "@/constants/mapStyle";
import { colors } from "@/constants/theme";
import { useLocationPickerStore } from "@/lib/store/locationPickerStore";
import * as Location from "expo-location";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const DEFAULT_REGION: Region = {
  latitude: -12.0464,
  longitude: -77.0428,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function LocationPickerScreen() {
  const mapRef = useRef<MapView>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentCoordsRef = useRef<{ latitude: number; longitude: number }>({
    latitude: DEFAULT_REGION.latitude,
    longitude: DEFAULT_REGION.longitude,
  });

  const setPickedLocation = useLocationPickerStore(
    (state) => state.setPickedLocation,
  );

  const [address, setAddress] = useState<string>(
    "Mueve el mapa para fijar el punto",
  );
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      try {
        const current = await Location.getCurrentPositionAsync({});
        const targetRegion = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        };
        currentCoordsRef.current = {
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        };
        mapRef.current?.animateToRegion(targetRegion, 500);
        resolveAddress(current.coords.latitude, current.coords.longitude);
      } catch {
        // Ignorar y usar fallback region
      }
    })();

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const resolveAddress = async (lat: number, lng: number) => {
    setResolving(true);
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      const first = results[0];
      if (first) {
        const parts = [first.name, first.street, first.city, first.region]
          .filter(Boolean)
          .filter((part, index, arr) => arr.indexOf(part) === index);
        setAddress(parts.join(", ") || "Ubicación sin nombre");
      } else {
        setAddress("Ubicación sin nombre");
      }
    } catch {
      setAddress("No se pudo obtener la dirección para este punto");
    } finally {
      setResolving(false);
    }
  };

  const handleRegionChangeComplete = (nextRegion: Region) => {
    currentCoordsRef.current = {
      latitude: nextRegion.latitude,
      longitude: nextRegion.longitude,
    };

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      resolveAddress(nextRegion.latitude, nextRegion.longitude);
    }, 400);
  };

  const handleCenterUserLocation = async () => {
    try {
      const current = await Location.getCurrentPositionAsync({});
      const targetRegion = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };
      currentCoordsRef.current = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };
      mapRef.current?.animateToRegion(targetRegion, 500);
      resolveAddress(current.coords.latitude, current.coords.longitude);
    } catch {
      // Ignorar si no se pudo obtener
    }
  };

  const handleConfirm = () => {
    setPickedLocation({
      address,
      latitude: currentCoordsRef.current.latitude,
      longitude: currentCoordsRef.current.longitude,
    });
    router.back();
  };

  return (
    <View className="flex-1 bg-background relative">
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
        userInterfaceStyle="dark"
        customMapStyle={darkMapStyle}
        onRegionChangeComplete={handleRegionChangeComplete}
      />

      {/* Pin fijo en el centro con PinMap */}
      <PinMap />

      {/* Botón de retroceso */}
      <SafeAreaView
        edges={["top"]}
        className="absolute top-0 left-5 right-0 z-10 px-4 pt-2"
      >
        <Pressable
          onPress={() => router.back()}
          className="size-12 items-center justify-center rounded-full bg-modal-background/90  active:opacity-75"
        >
          <Image
            source={icons.back}
            className="size-5"
            tintColor={colors.primary}
            resizeMode="contain"
          />
        </Pressable>
      </SafeAreaView>

      {/* Tarjeta flotante de confirmación de dirección */}
      <SafeAreaView
        edges={["bottom"]}
        className="absolute inset-x-4 bottom-4 gap-3 z-10"
      >
        {/* Botón flotante para centrar en mi ubicación GPS */}
        <LocationButton onPress={handleCenterUserLocation} />

        <View className="bg-modal-background border border-border rounded-3xl p-4 gap-4 shadow-2xl">
          <View className="flex-row items-center gap-3">
            <View className="size-10 rounded-full items-center justify-center">
              <Image
                source={icons.mapPin}
                className="size-5"
                tintColor={colors.destructive}
                resizeMode="contain"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-muted-foreground">
                Ubicación seleccionada
              </Text>
              <Text
                className="text-sm font-bold text-primary mt-0.5"
                numberOfLines={2}
              >
                {address}
              </Text>
            </View>
          </View>

          <Pressable
            className="items-center justify-center rounded-2xl bg-submodal-background py-4 active:opacity-90 disabled:opacity-50"
            onPress={handleConfirm}
            disabled={resolving}
          >
            <Text className="text-base font-bold text-primary">
              {resolving ? "Buscando dirección..." : "Confirmar ubicación"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
