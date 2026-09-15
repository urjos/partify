import { Pressable, Text, View } from "react-native";

interface CategoryChipsProps {
  items: readonly string[];
  selected: string | readonly string[] | null;
  onSelect: (item: string | null) => void;
  renderExtra?: React.ReactNode;
}

export default function CategoryChips({
  items,
  selected,
  onSelect,
  renderExtra,
}: CategoryChipsProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {items.map((item) => {
        const active = Array.isArray(selected)
          ? selected.includes(item)
          : selected === item;
        return (
          <Pressable
            key={item}
            onPress={() =>
              onSelect(active && !Array.isArray(selected) ? null : item)
            }
            className={active ? "form-chip form-chip-active" : "form-chip"}
          >
            <View className="flex-row items-center gap-1.5">
              <Text
                className={
                  active
                    ? "form-chip-text form-chip-text-active"
                    : "form-chip-text"
                }
              >
                {item}
              </Text>
            </View>
          </Pressable>
        );
      })}
      {renderExtra}
    </View>
  );
}
