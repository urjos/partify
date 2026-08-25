import EventForm from "@/components/event/EventForm";
import "@/global.css";
import { useEventStore } from "@/lib/store/eventStore";
import { router } from "expo-router";

const CreateEvent = () => {
  const addEvent = useEventStore((state) => state.addEvent);

  const handleSubmit = (draft: Omit<EventItem, "id">) => {
    const newEvent: EventItem = { ...draft, id: Date.now().toString() };
    addEvent(newEvent);
    router.replace(`/(events)/${newEvent.id}`);
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
