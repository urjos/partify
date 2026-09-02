import { ApiClient } from "@/lib/api/client";
import {
  mapApiEventToEventItem,
  mapEventDraftToApiPayload,
} from "@/lib/api/mappers";
import { create } from "zustand";

interface EventStore {
  events: EventItem[];
  loading: boolean;
  error: string | null;
  fetchEvents: (api: ApiClient) => Promise<void>;
  addEvent: (
    api: ApiClient,
    draft: Omit<EventItem, "id">,
  ) => Promise<EventItem>;
  updateEvent: (
    api: ApiClient,
    id: string,
    draft: Omit<EventItem, "id">,
  ) => Promise<void>;
  removeEvent: (api: ApiClient, id: string) => Promise<void>;
  setAttendance: (
    api: ApiClient,
    id: string,
    status: "going" | "interested" | null,
  ) => Promise<void>;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async (api) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get<{ data: any[] }>("/events");
      set({ events: data.map(mapApiEventToEventItem), loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load events",
      });
    }
  },

  addEvent: async (api, draft) => {
    const { data } = await api.post<{ data: any }>(
      "/events",
      mapEventDraftToApiPayload(draft),
    );
    const newEvent = mapApiEventToEventItem(data);
    set((state) => ({ events: [newEvent, ...state.events] }));
    return newEvent;
  },

  updateEvent: async (api, id, draft) => {
    const { data } = await api.put<{ data: any }>(
      `/events/${id}`,
      mapEventDraftToApiPayload(draft),
    );
    const updated = mapApiEventToEventItem(data);
    set((state) => ({
      events: state.events.map((event) => (event.id === id ? updated : event)),
    }));
  },

  removeEvent: async (api, id) => {
    await api.delete(`/events/${id}`);
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    }));
  },

  setAttendance: async (api, id, status) => {
    const { data } = await api.patch<{ data: any }>(
      `/events/${id}/attendance`,
      { status },
    );
    const updated = mapApiEventToEventItem(data);
    set((state) => ({
      events: state.events.map((event) => (event.id === id ? updated : event)),
    }));
  },
}));
