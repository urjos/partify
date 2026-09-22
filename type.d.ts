import type { ImageSourcePropType } from "react-native";

declare global {
  interface AppTab {
    name: string;
    title: string;
    icon: ImageSourcePropType;
  }

  interface TabIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
    title?: string;
  }

  interface ListHeadingProps {
    title: string;
  }

  type EventMediaItem =
    | { type: "image"; source: ImageSourcePropType; base64?: string }
    | { type: "video"; uri: string };

  interface EventItem {
    id: string;
    media: EventMediaItem[];
    title: string;
    dateLabel: string;
    startAt?: string;
    author: string;
    authorAvatar?: string;
    authorIsVerified?: boolean;
    distanceLabel?: string;
    location: string;
    latitude?: number;
    typeMusic?: string;
    longitude?: number;
    description: string;
    category: string;
    attendeeAvatars: ImageSourcePropType[];
    attendeeCount: number;
    rating: number;
    interestedCount: number;
    capacity?: number;
    price?: number;
    priceWomen?: number;
    isMultiplePrices?: boolean;
    isFreeEvent?: boolean;
    contactMethod?: "chat" | "external";
    externalTicketUrl?: string;
    contactPhone?: string;
    hideExactAddress?: boolean;
    closingAt?: string;
    isGoing?: boolean;
    isOwner?: boolean;
    attendanceStatus?: AttendanceStatus;
    authorId?: string;
    ratingsCount?: number;
    userRating?: number | null;
    isFavorite?: boolean;
    dressCode?: string;
    dressCodeDetails?: string;
    corkageFree?: boolean;
    openBar?: boolean;
    isAdultsOnly?: boolean;
    requirePhysicalId?: boolean;
  }

  interface EventCardProps extends Omit<EventItem, "id"> {
    id?: string;
    onPress: () => void;
    onContactPress?: () => void;
    onToggleFavorite?: () => void;
  }

  type AttendanceStatus = "going" | "interested" | null;

  interface AvatarStackProps {
    avatars: ImageSourcePropType[];
    count: number;
    maxVisible?: number;
    size?: "sm" | "md" | "xs";
  }
}

export {};
