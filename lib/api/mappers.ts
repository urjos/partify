import dayjs from "dayjs";
import "dayjs/locale/es";
import { ImageSourcePropType } from "react-native";

dayjs.locale("es");

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
  price?: number;
  priceWomen?: number;
  isMultiplePrices?: boolean;
  contactMethod?: "chat" | "external";
  paymentMethod?: "chat" | "external";
  contactPhone?: string;
  externalTicketUrl?: string;
  hideExactAddress?: boolean;
  author: string;
  authorAvatar?: string;
  authorIsVerified?: boolean;
  attendeeAvatars: string[];
  attendeeCount: number;
  interestedCount: number;
  attendanceStatus?: AttendanceStatus;
  isGoing?: boolean;
  isOwner?: boolean;
  authorId?: string;
  rating: number;
  ratingsCount?: number;
  userRating?: number | null;
  isFavorite?: boolean;
  dressCode?: string;
  dressCodeDetails?: string;
  corkageFree?: boolean;
  openBar?: boolean;
  isAdultsOnly?: boolean;
  requirePhysicalId?: boolean;
};

const formatClientDateLabel = (
  startAt?: string,
  closingAt?: string,
  fallback?: string,
): string => {
  if (!startAt) return fallback ?? "";
  try {
    const start = dayjs(startAt).locale("es");
    const formattedDate = start.format("ddd, D [de] MMM");
    const startTimeStr = start.format("h:mm A");
    if (closingAt) {
      const end = dayjs(closingAt).locale("es");
      const endTimeStr = end.format("h:mm A");
      return `${formattedDate} · ${startTimeStr} - ${endTimeStr}`;
    }
    return `${formattedDate} · ${startTimeStr}`;
  } catch {
    return fallback ?? "";
  }
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
  dateLabel:
    formatClientDateLabel(apiEvent.startAt, apiEvent.closingAt, apiEvent.dateLabel),
  location: apiEvent.location,
  latitude: apiEvent.latitude,
  longitude: apiEvent.longitude,
  capacity: apiEvent.capacity,
  isFreeEvent: apiEvent.isFreeEvent,
  price: apiEvent.price,
  priceWomen: apiEvent.priceWomen,
  isMultiplePrices: apiEvent.isMultiplePrices,
  contactMethod: apiEvent.contactMethod ?? apiEvent.paymentMethod ?? "chat",
  contactPhone: apiEvent.contactPhone ?? "",
  externalTicketUrl: apiEvent.externalTicketUrl ?? "",
  hideExactAddress: apiEvent.hideExactAddress ?? false,
  author: apiEvent.author,
  authorId: apiEvent.authorId,
  authorAvatar: apiEvent.authorAvatar,
  authorIsVerified: Boolean(apiEvent.authorIsVerified),
  attendeeAvatars: apiEvent.attendeeAvatars.map((uri) => ({ uri })),
  attendeeCount: apiEvent.attendeeCount,
  interestedCount: apiEvent.interestedCount,
  attendanceStatus:
    apiEvent.attendanceStatus ?? (apiEvent.isGoing ? "going" : null),
  isGoing: apiEvent.isGoing,
  isOwner: apiEvent.isOwner,
  rating: apiEvent.rating,
  ratingsCount: apiEvent.ratingsCount,
  userRating: apiEvent.userRating,
  isFavorite: apiEvent.isFavorite ?? false,
  dressCode: apiEvent.dressCode ?? "Casual",
  dressCodeDetails: apiEvent.dressCodeDetails ?? "",
  corkageFree: apiEvent.corkageFree ?? false,
  openBar: apiEvent.openBar ?? false,
  isAdultsOnly: apiEvent.isAdultsOnly ?? false,
  requirePhysicalId: apiEvent.requirePhysicalId ?? false,
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
  price: draft.isFreeEvent || draft.isMultiplePrices ? undefined : draft.price,
  priceWomen:
    draft.isFreeEvent || draft.isMultiplePrices ? undefined : draft.priceWomen,
  isMultiplePrices: draft.isMultiplePrices,
  contactMethod: draft.contactMethod ?? "chat",
  contactPhone: draft.contactPhone ?? "",
  externalTicketUrl: draft.externalTicketUrl ?? "",
  hideExactAddress: draft.hideExactAddress ?? false,
  dressCode: draft.dressCode ?? "Casual",
  dressCodeDetails: draft.dressCodeDetails ?? "",
  corkageFree: Boolean(draft.corkageFree),
  openBar: Boolean(draft.openBar),
  isAdultsOnly: Boolean(draft.isAdultsOnly),
  requirePhysicalId: Boolean(draft.requirePhysicalId),
});
