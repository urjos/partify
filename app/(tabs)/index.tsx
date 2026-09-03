import EventCard from "@/components/event/EventCard";
import Header from "@/components/home/Header";
import "@/global.css";
import { useApi } from "@/hooks/use-api";
import { useEventStore } from "@/lib/store/eventStore";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const api = useApi();
  const { isLoaded, isSignedIn } = useAuth();
  const { events, loading, error, fetchEvents } = useEventStore();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchEvents(api);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <SafeAreaView className="flex-1 bg-background page-all">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <Header separator isPressable={true} logo={true} title="Partify" />
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
        onRefresh={() => fetchEvents(api)}
        refreshing={loading}
        ListEmptyComponent={
          loading || !isLoaded || !isSignedIn ? (
            <View className="py-10 items-center">
              <ActivityIndicator color="#b24bfb" />
            </View>
          ) : error ? (
            <Text className="home-empty-state">
              Couldn't load events: {error}
            </Text>
          ) : (
            <Text className="home-empty-state">
              No events nearby yet — be the first to post one.
            </Text>
          )
        }
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
}
