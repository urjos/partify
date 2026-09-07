import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HostBanner() {
  return (
    <View className="host-banner">
      <View className="host-banner-content">
        <Text className="host-banner-title">
          ¿Tienes un espacio único?
        </Text>
        <Text className="host-banner-subtitle">
          Crea tu evento seguro, controla el aforo y gana dinero.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/create")}
        activeOpacity={0.8}
        className="host-banner-btn"
      >
        <Text className="host-banner-btn-text">Empezar</Text>
      </TouchableOpacity>
    </View>
  );
}
