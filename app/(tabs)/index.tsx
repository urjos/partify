import EventCard from "@/components/event/EventCard";
import Header from "@/components/home/header";
import Separator from "@/components/Separator";
import { MOCK_EVENTS } from "@/constants/mock-events";
import "@/global.css";
import { router } from "expo-router";
import { styled } from "nativewind";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background page-all">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <Header />
            <Separator />
          </>
        )}
        data={MOCK_EVENTS}
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
