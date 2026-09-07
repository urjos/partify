import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HostBanner() {
  return (
    <View className="mb-4 flex-row items-center justify-between rounded-3xl bg-card p-5">
      <View className="flex-1 gap-2">
        <Text className="mb-1 text-lg font-sans-bold text-primary">
          ¿Tienes un espacio único?
        </Text>
        <Text className="text-sm font-sans-medium text-muted-foreground leading-5">
          Crea tu evento seguro, controla el aforo y gana dinero.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/create")}
        activeOpacity={0.8}
        className="rounded-2xl bg-muted px-5 py-3"
      >
        <Text className="text-sm font-sans-bold text-primary">Empezar</Text>
      </TouchableOpacity>
    </View>
  );
}
