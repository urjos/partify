import { useLocationPickerStore } from "@/lib/store/locationPickerStore";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
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
  const setPickedLocation = useLocationPickerStore(
    (state) => state.setPickedLocation,
  );

  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [address, setAddress] = useState<string>("Move the map to set the pin");
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const current = await Location.getCurrentPositionAsync({});
      setRegion((prev) => ({
        ...prev,
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      }));
    })();
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
        setAddress(parts.join(", ") || "Unnamed location");
      } else {
        setAddress("Unnamed location");
      }
    } catch {
      setAddress("Couldn't resolve an address for this spot");
    } finally {
      setResolving(false);
    }
  };

  const handleRegionChangeComplete = (nextRegion: Region) => {
    setRegion(nextRegion);
    resolveAddress(nextRegion.latitude, nextRegion.longitude);
  };

  const handleConfirm = () => {
    setPickedLocation({
      address,
      latitude: region.latitude,
      longitude: region.longitude,
    });
    router.back();
  };

  return (
    <View className="location-picker-container">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={DEFAULT_REGION}
        region={region}
        onRegionChangeComplete={handleRegionChangeComplete}
      />

      {/* Pin fijo en el centro — el mapa se mueve debajo, el pin no */}
      <View className="location-picker-pin-wrap" pointerEvents="none">
        <Ionicons name="location" size={40} color="#b24bfb" />
      </View>

      <SafeAreaView edges={["top"]} className="location-picker-top">
        <Pressable
          onPress={() => router.back()}
          className="location-picker-back-btn"
        >
          <Ionicons name="chevron-back" size={22} color="#f5f4f2" />
        </Pressable>
      </SafeAreaView>

      <SafeAreaView edges={["bottom"]} className="location-picker-bottom">
        <View className="location-picker-address-bar">
          <Ionicons name="location-outline" size={18} color="#b24bfb" />
          <Text className="location-picker-address-text" numberOfLines={2}>
            {resolving ? "Finding address..." : address}
          </Text>
        </View>
        <Pressable
          className="location-picker-confirm-btn"
          onPress={handleConfirm}
          disabled={resolving}
        >
          <Text className="location-picker-confirm-text">
            Confirm this location
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
