import Skeleton from "@/components/Skeleton";
import { View } from "react-native";

const EventCardSkeleton = () => (
  <View className="event-card gap-2">
    <View className="event-image-wrap">
      <Skeleton className="h-full w-full" />
    </View>
    <View className="event-body px-4 gap-2">
      <Skeleton className="h-5 w-3/4 rounded-md" />
      <View className="event-meta-row">
        <Skeleton className="h-3 w-28 rounded-md" />
      </View>
    </View>
  </View>
);

export default EventCardSkeleton;
