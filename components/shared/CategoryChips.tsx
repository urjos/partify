import { Pressable, Text, View } from "react-native";

interface CategoryChipsProps {
  items: readonly string[];
  selected: string | null;
  onSelect: (item: string | null) => void;
}

export default function CategoryChips({
  items,
  selected,
  onSelect,
}: CategoryChipsProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {items.map((item) => {
        const active = selected === item;
        return (
          <Pressable
            key={item}
            onPress={() => onSelect(active ? null : item)}
            className={active ? "form-chip form-chip-active" : "form-chip"}
          >
            <Text
              className={
                active
                  ? "form-chip-text form-chip-text-active"
                  : "form-chip-text"
              }
            >
              {item}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
