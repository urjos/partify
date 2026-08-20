import EventCard from "@/components/event/EventCard";
import "@/global.css";
import { useEventStore } from "@/lib/eventStore";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const { events } = useEventStore();

  const filteredEvents = events.filter(
    (events) =>
      events.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      events.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      events.dateLabel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      events.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background page-all">
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <View className="search-header">
              <TextInput
                className="search-input"
                placeholder="Search events..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <EventCard
            {...item}
            onPress={() => router.push(`/(events)/${item.id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View className="h-4" />}
        keyboardDismissMode="on-drag"
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
}
