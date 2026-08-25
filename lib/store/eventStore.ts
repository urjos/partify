import { MOCK_EVENTS } from "@/constants/mock-events";
import { create } from "zustand";

interface EventStore {
  events: EventItem[];
  addEvent: (event: EventItem) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  removeEvent: (id: string) => void;
  setEvent: (event: EventItem[]) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: MOCK_EVENTS,
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updates } : event,
      ),
    })),
  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
  setEvent: (events) => set({ events }),
}));
