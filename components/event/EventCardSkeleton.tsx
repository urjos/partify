import Skeleton from "@/components/Skeleton";
import { View } from "react-native";

const EventCardSkeleton = () => (
  <View className="event-card">
    <View className="event-image-wrap">
      <Skeleton className="h-full w-full" />
    </View>
    <View className="event-body">
      <Skeleton className="h-5 w-3/4 rounded-md" />
      <View className="event-meta-row">
        <Skeleton className="h-3 w-28 rounded-md" />
      </View>
      <View className="event-footer-row">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="-ml-2 h-7 w-7 rounded-full" />
        <Skeleton className="-ml-2 h-7 w-7 rounded-full" />
      </View>
    </View>
  </View>
);

export default EventCardSkeleton;
