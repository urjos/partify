import SearchMap from "@/components/search/SearchMap";
import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import "@/global.css";
import { useEventStore } from "@/lib/store/eventStore";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { Image, Pressable, TextInput, View } from "react-native";
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
    <View className="flex-1 bg-background">
      <SafeAreaView
        edges={["top", "left", "right"]}
        className="absolute top-0 left-0 right-0 z-10 bg-background/80"
      >
        <View className="search-header-container">
          <Pressable
            onPress={() => router.back()}
            className="search-back-btn page-all"
          >
            <Image
              source={icons.back}
              className="search-icon"
              tintColor={colors.primary}
              resizeMode="contain"
            />
          </Pressable>
          <View className="search-bar-row page-all">
            <View className="search-input-container">
              <Image
                source={icons.search}
                className="search-input-icon"
                tintColor={colors.primary}
                resizeMode="contain"
              />
              <TextInput
                numberOfLines={1}
                className="search-input"
                placeholder="Busca tu evento..."
                placeholderTextColor={colors.mutedForeground}
                value={searchQuery}
                onChangeText={setSearchQuery}
                selectionColor={colors.accentPink}
              />
              <Pressable
                onPress={() => setSearchQuery("")}
                className="search-clear-btn"
              >
                <Image
                  source={icons.x}
                  className="search-clear-icon"
                  tintColor={colors.primary}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
            <Pressable className="search-filter-btn">
              <Image
                source={icons.filter}
                className="search-filter-icon"
                tintColor={colors.primary}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
      <SearchMap events={filteredEvents} />
    </View>
  );
}
