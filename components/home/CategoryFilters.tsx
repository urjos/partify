import HorizontalChips from "@/components/shared/HorizontalChips";
import { useEventStore } from "@/lib/store/eventStore";
import { View } from "react-native";

export const SCHEDULE_FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "hoy", label: "Hoy" },
  { id: "manana", label: "Mañana" },
  { id: "finde", label: "Fin de semana" },
  { id: "cerca", label: "Cerca de ti" },
];

export default function CategoryFilters({ className }: { className?: string }) {
  const { activeFilter, setActiveFilter } = useEventStore();

  return (
    <View className={`${className} home-filters-wrap`}>
      <HorizontalChips
        items={SCHEDULE_FILTERS}
        selected={activeFilter}
        onSelect={setActiveFilter}
      />
    </View>
  );
}
