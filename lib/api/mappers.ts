import { ImageSourcePropType } from "react-native";

type ApiMediaItem = { type: "image" | "video"; url: string };

type ApiEvent = {
  id: string;
  media: ApiMediaItem[];
  title: string;
  description: string;
  category: string;
  startAt: string;
  closingAt?: string;
  dateLabel: string;
  location: string;
  latitude: number;
  longitude: number;
  typeMusic?: string;
  capacity?: number;
  isFreeEvent: boolean;
  price: number;
  priceWomen?: number;
  isMultiplePrices?: boolean;
  paymentMethod?: "chat" | "external";
  contactPhone?: string;
  externalTicketUrl?: string;
  hideExactAddress?: boolean;
  author: string;
  authorAvatar?: string;
  attendeeAvatars: string[];
  attendeeCount: number;
  interestedCount: number;
  isGoing?: boolean;
  isOwner?: boolean;
  rating: number;
};

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
  typeMusic: apiEvent.typeMusic,
  startAt: apiEvent.startAt,
  closingAt: apiEvent.closingAt,
  dateLabel: apiEvent.dateLabel,
  location: apiEvent.location,
  latitude: apiEvent.latitude,
  longitude: apiEvent.longitude,
  capacity: apiEvent.capacity,
  isFreeEvent: apiEvent.isFreeEvent,
  price: apiEvent.price,
  priceWomen: apiEvent.priceWomen,
  isMultiplePrices: apiEvent.isMultiplePrices,
  paymentMethod: apiEvent.paymentMethod ?? "chat",
  contactPhone: apiEvent.contactPhone ?? "",
  externalTicketUrl: apiEvent.externalTicketUrl ?? "",
  hideExactAddress: apiEvent.hideExactAddress ?? false,
  author: apiEvent.author,
  authorAvatar: apiEvent.authorAvatar,
  attendeeAvatars: apiEvent.attendeeAvatars.map((uri) => ({ uri })),
  attendeeCount: apiEvent.attendeeCount,
  interestedCount: apiEvent.interestedCount,
  isGoing: apiEvent.isGoing,
  isOwner: apiEvent.isOwner,
  rating: apiEvent.rating,
});

const getImageUri = (source: ImageSourcePropType): string | undefined => {
  if (typeof source === "object" && "uri" in source) return source.uri;
  return undefined;
};

// Dirección inversa: lo que arma EventForm hacia el body que espera el
// controller (media con url, location como objeto, contactPhone, etc.).
export const mapEventDraftToApiPayload = (draft: Omit<EventItem, "id">) => ({
  title: draft.title,
  description: draft.description,
  category: draft.category,
  typeMusic: draft.typeMusic,
  startAt: draft.startAt,
  closingAt: draft.closingAt,
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
  priceWomen: draft.priceWomen,
  isMultiplePrices: draft.isMultiplePrices,
  paymentMethod: draft.paymentMethod ?? "chat",
  contactPhone: draft.contactPhone ?? "",
  externalTicketUrl: draft.externalTicketUrl ?? "",
  hideExactAddress: draft.hideExactAddress ?? false,
});
