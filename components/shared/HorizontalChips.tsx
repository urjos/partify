import { Pressable, ScrollView, Text, View } from "react-native";

export interface ChipItem {
  id: string;
  label: string;
}

interface HorizontalChipsProps {
  items: ChipItem[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function HorizontalChips({
  items,
  selected,
  onSelect,
}: HorizontalChipsProps) {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {items.map((item) => {
          const isActive = item.id === selected;
          return (
            <Pressable
              key={item.id}
              onPress={() => onSelect(item.id)}
              className={`home-filter-chip ${isActive ? "home-filter-chip-active" : ""}`}
            >
              <Text
                className={`home-filter-text ${isActive ? "home-filter-text-active" : ""}`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
