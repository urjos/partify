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
  }

  interface UpcomingSubscription {
    id: string;
    icon: ImageSourcePropType;
    name: string;
    price: number;
    currency?: string;
    daysLeft: number;
  }

  interface UpcomingSubscriptionCardProps extends Omit<
    UpcomingSubscription,
    "id"
  > {}

  interface ListHeadingProps {
    title: string;
  }

  type EventMediaItem =
    | { type: "image"; source: ImageSourcePropType }
    | { type: "video"; uri: string };

  interface EventItem {
    id: string;
    media: EventMediaItem[];
    title: string;
    dateLabel: string;
    author: string;
    distanceLabel?: string;
    location: string;
    latitude?: number;
    longitude?: number;
    description: string;
    category: string;
    attendeeAvatars: ImageSourcePropType[];
    attendeeCount: number;
    interestedCount: number;
    isGoing?: boolean;
    isOwner?: boolean;
  }

  interface EventCardProps extends Omit<EventItem, "id"> {
    onPress: () => void;
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
