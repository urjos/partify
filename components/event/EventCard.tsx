import AvatarStack from "@/components/event/AvatarStack";
import { Image, Pressable, Text, View } from "react-native";

const EventCard = ({
  image,
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
    <Pressable onPress={onPress} className="event-card">
      <View className="event-image-wrap">
        <Image source={image} className="event-image" resizeMode="cover" />
        <View className="event-category-chip">
          <Text className="event-category-text">{category}</Text>
        </View>
      </View>

      <View className="event-body">
        <Text numberOfLines={1} className="event-title">
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

          {isGoing ? (
            <View className="event-going-badge">
              <Text className="event-going-badge-text">Going</Text>
            </View>
          ) : (
            <View className="event-interested-badge">
              <Text className="event-interested-badge-text">Interested</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default EventCard;
