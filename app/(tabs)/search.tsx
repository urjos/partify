import MapEventModal from "@/components/search/MapEventModal";
import SearchFilterModal, {
  SearchFilters,
} from "@/components/search/SearchFilterModal";
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

const DEFAULT_FILTERS: SearchFilters = {
  distance: 25,
  category: null,
  schedule: "todos",
  priceMin: "",
  priceMax: "",
  instantConfirm: false,
  openBar: false,
  corkageFree: false,
};

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] =
    useState<SearchFilters>(DEFAULT_FILTERS);
  const { events } = useEventStore();

  const hasActiveFilters =
    activeFilters.category !== null ||
    activeFilters.schedule !== "todos" ||
    activeFilters.priceMin !== "" ||
    activeFilters.priceMax !== "" ||
    activeFilters.instantConfirm ||
    activeFilters.openBar ||
    activeFilters.corkageFree;

  const filteredEvents = events.filter((event) => {
    // Búsqueda por texto
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !query ||
      event.title.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      event.dateLabel?.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query);

    // Filtro de categoría
    const matchesCategory =
      !activeFilters.category || event.category === activeFilters.category;

    // Filtro de precio mínimo
    const minPrice = activeFilters.priceMin
      ? parseFloat(activeFilters.priceMin)
      : null;
    const maxPrice = activeFilters.priceMax
      ? parseFloat(activeFilters.priceMax)
      : null;
    const eventPrice =
      typeof event.price === "number"
        ? event.price
        : parseFloat(event.price ?? "0");
    const matchesMinPrice = minPrice === null || eventPrice >= minPrice;
    const matchesMaxPrice = maxPrice === null || eventPrice <= maxPrice;

    return (
      matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice
    );
  });

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView
        edges={["top", "left", "right"]}
        className="absolute top-0 left-0 right-0 z-10 "
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
            <Pressable
              className="search-filter-btn"
              onPress={() => setFilterVisible(true)}
            >
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
      <SearchMap
        key="search-map-component"
        events={filteredEvents}
        onEventPress={setSelectedEvent}
      />
      <MapEventModal
        key="map-event-modal"
        event={selectedEvent}
        visible={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onDetailsPress={(id) => {
          setSelectedEvent(null);
          router.push(`/(events)/${id}`);
        }}
        onContactPress={() => {
          // Acción del contacto
        }}
      />
      <SearchFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(filters) => setActiveFilters(filters)}
        initialFilters={activeFilters}
      />
    </View>
  );
}
