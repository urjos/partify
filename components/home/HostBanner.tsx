import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function HostBanner() {
  return (
    <View className="mb-4 flex-row items-center justify-between rounded-3xl bg-card p-5">
      <View className="flex-1 pr-4 gap-1">
        <Text className="text-base font-bold text-primary">
          ¿Tienes un espacio único?
        </Text>
        <Text className="text-xs font-medium text-muted-foreground leading-5">
          Crea tu evento seguro, controla el aforo y gana dinero.
        </Text>
      </View>
      <Pressable
        onPress={() => router.push("/create")}
        className="rounded-2xl bg-muted px-5 py-3 active:opacity-80 items-center justify-center"
      >
        <Text className="text-xs font-bold text-primary">Empezar</Text>
      </Pressable>
    </View>
  );
}
