import EventMediaCarousel from "@/components/event/EventMediaCarousel";
import { icons } from "@/constants/icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";

const EventCard = ({
  media,
  title,
  dateLabel,
  distanceLabel,
  location,
  category,
  author,
  onPress,
}: EventCardProps) => {
  return (
    <Pressable onPress={onPress} className="event-card">
      <View className="event-image-wrap">
        {/* Background Image/Carousel */}
        <EventMediaCarousel
          media={media}
          className="event-image"
          onPress={onPress}
        />

        {/* Dark Overlays for text readability */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,1)"]}
          locations={[0.3, 0.7, 1]}
          className="event-overlay-gradient"
          pointerEvents="none"
        />

        {/* Content Wrapper */}
        <View className="event-content">
          {/* Category & Location */}
          <View className="event-header-row">
            <View className="event-category-chip">
              <Text className="event-category-text">{category}</Text>
            </View>
            <Text className="event-location-text">
              {distanceLabel || location}
            </Text>
          </View>

          {/* Title */}
          <Text numberOfLines={2} className="event-title">
            {title}
          </Text>

          {/* Meta & Actions */}
          <View className="event-footer-row">
            {/* Left: Author & Time */}
            <View className="event-meta-stack">
              <View className="event-meta-row">
                <Image
                  source={icons.verified}
                  className="event-meta-icon"
                  tintColor="#ea4bc8"
                  resizeMode="contain"
                />
                <Text className="event-meta-text">{author}</Text>
                <View className="event-rating-row">
                  <Text className="event-rating-text">4.9</Text>
                  <Image
                    source={icons.star}
                    className="event-meta-icon"
                    tintColor="#ea4bc8"
                    resizeMode="contain"
                  />
                </View>
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

            {/* Right: Actions */}
            <View className="event-actions-row">
              <Pressable className="event-contact-btn">
                <Image
                  source={icons.messageSquareText}
                  className="event-meta-icon"
                  tintColor="#e5e7eb"
                  resizeMode="contain"
                />
                <Text className="event-contact-text">Contactar</Text>
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
