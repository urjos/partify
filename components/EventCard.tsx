import { Image, Pressable, Text, View } from "react-native";

const MAX_VISIBLE_AVATARS = 3;

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
  const visibleAvatars = attendeeAvatars.slice(0, MAX_VISIBLE_AVATARS);
  const extraCount = attendeeCount - visibleAvatars.length;

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
          <View className="event-avatar-stack">
            {visibleAvatars.map((avatar, index) => (
              <Image key={index} source={avatar} className="event-avatar" />
            ))}
            {extraCount > 0 ? (
              <Text className="event-attendee-count">+{extraCount}</Text>
            ) : null}
          </View>

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
