import EventForm from "@/components/event/EventForm";
import "@/global.css";
import { useApi } from "@/hooks/use-api";
import { useEventStore } from "@/lib/store/eventStore";
import { router } from "expo-router";
import { Alert } from "react-native";

const CreateEvent = () => {
  const api = useApi();
  const addEvent = useEventStore((state) => state.addEvent);

  const handleSubmit = async (draft: Omit<EventItem, "id">) => {
    try {
      const newEvent = await addEvent(api, draft);
      router.replace(`/(events)/${newEvent.id}`);
    } catch (error) {
      Alert.alert(
        "Couldn't publish event",
        error instanceof Error ? error.message : "Try again in a moment.",
      );
    }
  };

  return (
    <EventForm
      screenTitle="New event"
      submitLabel="Publish event"
      submittingLabel="Publishing..."
      onSubmit={handleSubmit}
    />
  );
};

export default CreateEvent;
