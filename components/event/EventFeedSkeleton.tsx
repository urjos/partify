import EventCardSkeleton from "@/components/event/EventCardSkeleton";
import { View } from "react-native";

type EventFeedSkeletonProps = {
  count?: number;
};

const EventFeedSkeleton = ({ count = 4 }: EventFeedSkeletonProps) => (
  <View className="gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <EventCardSkeleton key={index} />
    ))}
  </View>
);

export default EventFeedSkeleton;
