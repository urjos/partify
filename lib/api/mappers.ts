import { ImageSourcePropType } from "react-native";

type ApiMediaItem = { type: "image" | "video"; url: string };

type ApiEvent = {
  id: string;
  media: ApiMediaItem[];
  title: string;
  description: string;
  category: string;
  startAt: string;
  dateLabel: string;
  location: string;
  latitude: number;
  longitude: number;
  capacity?: number;
  isFreeEvent: boolean;
  price: number;
  author: string;
  attendeeAvatars: string[];
  attendeeCount: number;
  interestedCount: number;
  isGoing?: boolean;
  isOwner?: boolean;
};
// El backend guarda media como { type, url }. El frontend (EventCard,
// EventForm, el carrusel) espera { type: "video", uri } o
// { type: "image", source: { uri } } — son formas distintas a propósito,
// para poder usar require() de imágenes locales en los mocks.
export const mapApiEventToEventItem = (apiEvent: ApiEvent): EventItem => ({
  id: apiEvent.id,
  media: apiEvent.media.map((item) =>
    item.type === "video"
      ? { type: "video", uri: item.url }
      : { type: "image", source: { uri: item.url } },
  ),
  title: apiEvent.title,
  description: apiEvent.description,
  category: apiEvent.category,
  startAt: apiEvent.startAt,
  dateLabel: apiEvent.dateLabel,
  location: apiEvent.location,
  latitude: apiEvent.latitude,
  longitude: apiEvent.longitude,
  capacity: apiEvent.capacity,
  isFreeEvent: apiEvent.isFreeEvent,
  price: apiEvent.price,
  author: apiEvent.author,
  attendeeAvatars: apiEvent.attendeeAvatars.map((uri) => ({ uri })),
  attendeeCount: apiEvent.attendeeCount,
  interestedCount: apiEvent.interestedCount,
  isGoing: apiEvent.isGoing,
  isOwner: apiEvent.isOwner,
});

const getImageUri = (source: ImageSourcePropType): string | undefined => {
  if (typeof source === "object" && "uri" in source) return source.uri;
  return undefined;
};

// Dirección inversa: lo que arma EventForm (media con source/uri sueltos,
// location como string + lat/lng planos) hacia el body que espera el
// controller (media con url, location como objeto).
export const mapEventDraftToApiPayload = (draft: Omit<EventItem, "id">) => ({
  title: draft.title,
  description: draft.description,
  category: draft.category,
  startAt: draft.startAt,
  media: draft.media.map((item) =>
    item.type === "video"
      ? { type: "video", url: item.uri }
      : { type: "image", url: getImageUri(item.source) },
  ),
  location: {
    address: draft.location,
    latitude: draft.latitude,
    longitude: draft.longitude,
  },
  capacity: draft.capacity,
  isFreeEvent: draft.isFreeEvent,
  price: draft.price,
});
