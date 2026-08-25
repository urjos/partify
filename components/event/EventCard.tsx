import AvatarStack from "@/components/event/AvatarStack";
import EventMediaCarousel from "@/components/event/EventMediaCarousel";
import { Pressable, Text, View } from "react-native";

const EventCard = ({
  media,
  title,
  dateLabel,
  distanceLabel,
  category,
  attendeeAvatars,
  attendeeCount,
  isGoing,
  onPress,
}: EventCardProps) => {
  return (
    <View className="event-card">
      <View className="event-image-wrap">
        <EventMediaCarousel
          media={media}
          className="event-image"
          onPress={onPress}
        />
        <View className="event-category-chip">
          <Text className="event-category-text">{category}</Text>
        </View>
      </View>

      <Pressable onPress={onPress} className="event-body">
        <Text numberOfLines={2} className="event-title">
          {title}
        </Text>

        <View className="event-meta-row">
          <Text numberOfLines={1} className="event-meta-text">
            {dateLabel}
          </Text>
          {distanceLabel ? (
            <>
              <View className="event-meta-dot" />
              <Text numberOfLines={1} className="event-meta-text">
                {distanceLabel}
              </Text>
            </>
          ) : null}
        </View>

        <View className="event-footer-row">
          <AvatarStack avatars={attendeeAvatars} count={attendeeCount} />
        </View>
      </Pressable>
    </View>
  );
};

export default EventCard;
