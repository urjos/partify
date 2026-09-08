import EventMediaCarousel from "@/components/event/EventMediaCarousel";
import { icons } from "@/constants/icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";

const EventCard = ({
  media,
  title,
  dateLabel,
  location,
  category,
  author,
  rating,
  onPress,
}: EventCardProps) => {
  return (
    <Pressable onPress={onPress} className="event-card">
      <View className="event-image-wrap">
        <EventMediaCarousel
          media={media}
          className="event-image"
          onPress={onPress}
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,1)"]}
          locations={[0.3, 0.7, 1]}
          className="event-overlay-gradient"
          pointerEvents="none"
        />

        <View className="event-content">
          <View className="event-header-row">
            <View className="event-category-chip">
              <Text className="event-category-text">{category}</Text>
            </View>
            <Text numberOfLines={1} className="event-location-text">
              {location}
            </Text>
          </View>

          <View className="pb-4 flex-row gap-2 items-center">
            <Text numberOfLines={1} className="event-title">
              {title}
            </Text>
            <View className="event-rating-row">
              <Text className="event-rating-text">{rating}</Text>
              <Image
                source={icons.star}
                className="event-meta-icon"
                tintColor="#ea4bc8"
                resizeMode="contain"
              />
            </View>
          </View>

          <View className="event-footer-row">
            <View className="event-meta-stack">
              <View className="event-meta-row">
                <Image
                  source={icons.verified}
                  className="event-meta-icon"
                  tintColor="#ea4bc8"
                  resizeMode="contain"
                />
                <Text className="event-meta-text">{author}</Text>
              </View>
              <View className="event-meta-row">
                <Image
                  source={icons.clock}
                  className="event-meta-icon"
                  tintColor="#d1d5db"
                  resizeMode="contain"
                />
                <Text className="event-time-text">{dateLabel}</Text>
              </View>
            </View>

            <View className="event-actions-row">
              <Pressable className="event-contact-btn">
                <Image
                  source={icons.messageSquareText}
                  className="event-message-icon"
                  tintColor="#e5e7eb"
                  resizeMode="contain"
                />
              </Pressable>
              <Pressable className="event-bookmark-btn">
                <Image
                  source={icons.bookmark}
                  className="event-bookmark-icon"
                  tintColor="#e5e7eb"
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default EventCard;
