import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const filtersInitialState = [
  { id: "hoy", label: "Hoy", active: true },
  { id: "manana", label: "Mañana", active: false },
  { id: "finde", label: "Fin de semana", active: false },
  { id: "cerca", label: "Cerca de ti", active: false },
];

export default function CategoryFilters() {
  const [filters, setFilters] = useState(filtersInitialState);

  const handleFilter = (id: string) => {
    setFilters(
      filters.map((filter) => ({
        ...filter,
        active: filter.id === id,
      })),
    );
  };

  return (
    <View className="home-filters-wrap">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="home-filters-scroll"
      >
        {filters.map((filter) => (
          <Pressable
            onPress={() => handleFilter(filter.id)}
            key={filter.id}
            className={`home-filter-chip ${filter.active ? "home-filter-chip-active" : ""}`}
          >
            <Text
              className={`home-filter-text ${filter.active ? "home-filter-text-active" : ""}`}
            >
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
