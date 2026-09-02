import EventForm from "@/components/event/EventForm";
import "@/global.css";
import { useApi } from "@/hooks/use-api";
import { useEventStore } from "@/lib/store/eventStore";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ICON_COLOR = "#f5f4f2";

export default function EditEvent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const api = useApi();
  const events = useEventStore((state) => state.events);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const event = events.find((item) => item.id === id);

  if (!event || !event.isOwner) {
    return (
      <SafeAreaView className="event-detail-empty">
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

  const handleSubmit = async (draft: Omit<EventItem, "id">) => {
    try {
      await updateEvent(api, event.id, draft);
      router.replace(`/(events)/${event.id}`);
    } catch (error) {
      Alert.alert(
        "Couldn't save changes",
        error instanceof Error ? error.message : "Try again in a moment.",
      );
    }
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
