import EventCard from "@/components/event/EventCard";
import EventFeedSkeleton from "@/components/event/EventFeedSkeleton";
import CategoryFilters from "@/components/home/CategoryFilters";
import Header from "@/components/home/Header";
import HostBanner from "@/components/home/HostBanner";
import "@/global.css";
import { useApi } from "@/hooks/use-api";
import { useEventStore } from "@/lib/store/eventStore";
import { useAuth } from "@clerk/expo";
import clsx from "clsx";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
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
    <SafeAreaView
      edges={["top", "left", "right"]}
      className={clsx("flex-1", "bg-background", "page-all")}
    >
      <FlatList
        ListHeaderComponent={() => (
          <>
            <Header isPressable={true} logo={true} title="Partify" />
            {/*<LocationFilter />*/}
            <CategoryFilters />
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
        ItemSeparatorComponent={() => <View className="h-5" />}
        showsVerticalScrollIndicator={false}
        onRefresh={() => fetchEvents(api)}
        refreshing={loading}
        ListEmptyComponent={
          loading || !isLoaded || !isSignedIn ? (
            <EventFeedSkeleton />
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
        contentContainerClassName="pb-6"
        ListFooterComponent={
          <>
            <View className="mt-6">
              <HostBanner />
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}
