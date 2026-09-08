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
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import * as Location from "expo-location";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const api = useApi();
  const { isLoaded, isSignedIn } = useAuth();
  const { events, loading, error, fetchEvents, activeFilter } = useEventStore();
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const loadData = async () => {
      setLocationError(null);
      if (activeFilter === "cerca") {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permiso denegado",
            "Necesitamos tu ubicación para mostrar eventos cercanos.",
          );
          setLocationError("Permiso de ubicación denegado.");
          return;
        }

        try {
          const location = await Location.getCurrentPositionAsync({});
          fetchEvents(api, {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          });
        } catch (err) {
          Alert.alert("Error", "No se pudo obtener la ubicación.");
          setLocationError("Error obteniendo ubicación.");
        }
      } else {
        fetchEvents(api);
      }
    };

    loadData();
  }, [isLoaded, isSignedIn, activeFilter]);

  const filteredEvents = useMemo(() => {
    const today = dayjs().startOf("day");
    return events.filter((event) => {
      if (!event.startAt) return true;
      const eventDate = dayjs(event.startAt);

      switch (activeFilter) {
        case "hoy":
          return eventDate.isSame(today, "day");
        case "manana":
          return eventDate.isSame(today.add(1, "day"), "day");
        case "finde":
          const dayOfWeek = eventDate.day();
          return (
            ((dayOfWeek === 5 && eventDate.hour() >= 17) ||
              dayOfWeek === 6 ||
              dayOfWeek === 0) &&
            eventDate.isSameOrAfter(today)
          );
        default:
          return true;
      }
    });
  }, [events, activeFilter]);

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      className={clsx("flex-1", "bg-background", "page-all")}
    >
      <View className="bg-background z-10 pb-2">
        <Header isPressable={true} logo={true} title="Partify" />
        <CategoryFilters />
      </View>
      <FlatList
        data={filteredEvents}
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
          ) : error || locationError ? (
            <Text className="home-empty-state">{error || locationError}</Text>
          ) : (
            <Text className="home-empty-state">
              No events found for this filter.
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
