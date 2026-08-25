import EventForm from "@/components/event/EventForm";
import "@/global.css";
import { useEventStore } from "@/lib/store/eventStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ICON_COLOR = "#f5f4f2";

export default function EditEvent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const events = useEventStore((state) => state.events);
  const event = events.find((item) => item.id === id);
  const updateEvent = useEventStore((state) => state.updateEvent);

  if (!event || !event.isOwner) {
    return (
      <SafeAreaView className="event-detail-empty">
        <Text className="text-red-800">jeje</Text>
        <Ionicons name="lock-closed-outline" size={32} color={ICON_COLOR} />
        <Text className="event-detail-empty-text">
          You can only edit events you created.
        </Text>
        <Pressable
          className="auth-secondary-button"
          onPress={() => router.back()}
        >
          <Text className="auth-secondary-button-text">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleSubmit = (draft: Omit<EventItem, "id">) => {
    updateEvent(event.id, draft);
    router.replace(`../(events)/${event.id}`);
  };

  return (
    <EventForm
      screenTitle="Edit event"
      submitLabel="Save changes"
      submittingLabel="Saving..."
      initialEvent={event}
      onSubmit={handleSubmit}
    />
  );
}
