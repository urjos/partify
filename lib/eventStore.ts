import { MOCK_EVENTS } from "@/constants/mock-events";
import { create } from "zustand";

interface EventStore {
  events: EventItem[];
  addEvent: (event: EventItem) => void;
  setEvent: (event: EventItem[]) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: MOCK_EVENTS,
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  setEvent: (events) => set({ events }),
}));
