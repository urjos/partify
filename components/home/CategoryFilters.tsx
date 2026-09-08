import { Pressable, ScrollView, Text, View } from "react-native";
import { useEventStore } from "@/lib/store/eventStore";

const filtersConfig = [
  { id: "todos", label: "Todos" },
  { id: "hoy", label: "Hoy" },
  { id: "manana", label: "Mañana" },
  { id: "finde", label: "Fin de semana" },
  { id: "cerca", label: "Cerca de ti" },
];

export default function CategoryFilters() {
  const { activeFilter, setActiveFilter } = useEventStore();

  return (
    <View className="home-filters-wrap">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="home-filters-scroll"
      >
        {filtersConfig.map((filter) => {
          const isActive = filter.id === activeFilter;
          return (
            <Pressable
              onPress={() => setActiveFilter(filter.id)}
              key={filter.id}
              className={`home-filter-chip ${isActive ? "home-filter-chip-active" : ""}`}
            >
              <Text
                className={`home-filter-text ${isActive ? "home-filter-text-active" : ""}`}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
