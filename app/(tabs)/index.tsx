import EventCard from "@/components/event/EventCard";
import Header from "@/components/home/Header";
import "@/global.css";
import { useEventStore } from "@/lib/store/eventStore";
import { router } from "expo-router";
import { styled } from "nativewind";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { events } = useEventStore();

  return (
    <SafeAreaView className="flex-1 bg-background page-all">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <Header separator isPressable={true} title="Partify" />
          </>
        )}
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            {...item}
            onPress={() => router.push(`/(events)/${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">
            No events nearby yet — be the first to post one.
          </Text>
        }
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
}
