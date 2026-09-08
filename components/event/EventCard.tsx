import EventMediaCarousel from "@/components/event/EventMediaCarousel";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";

dayjs.locale("es");

const EventCard = ({
  media,
  title,
  dateLabel,
  location,
  category,
  startAt,
  author,
  authorAvatar,
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
      </View>

      <View className="event-content">
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent"]}
          locations={[0, 0.2]}
          className="absolute inset-0"
          pointerEvents="none"
        />
        <View className="event-header-row">
          <View className="event-category-chip">
            <Text className="event-category-text">{category}</Text>
          </View>
          <Text numberOfLines={1} className="event-location-text">
            {location?.split(",").slice(-2, -1)[0]?.trim() || location}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          {/* Maximo de 30 caracteres para titulo*/}
          <Text numberOfLines={1} className="event-title">
            {title}
          </Text>
          {rating && (
            <View className="event-rating-row">
              <Text className="event-rating-text">{rating}</Text>
              <Image
                source={icons.star}
                className="event-meta-icon"
                tintColor="#ea4bc8"
                resizeMode="contain"
              />
            </View>
          )}
        </View>

        <View className="event-footer-row">
          <View className="event-meta-stack">
            <View className="event-meta-row">
              <Image
                source={authorAvatar ? { uri: authorAvatar } : images.avatar}
                className="w-5 h-5 rounded-full"
              />
              <Text className="event-meta-text">{author}</Text>
              <Image
                source={icons.verified}
                className="event-meta-icon"
                tintColor="#ea4bc8"
                resizeMode="contain"
              />
            </View>
            <View className="event-meta-row">
              <Image
                source={icons.clock}
                className="event-meta-icon"
                tintColor="#d1d5db"
                resizeMode="contain"
              />
              <Text className="event-time-text">
                {dateLabel
                  ? `${dayjs(startAt).format("D [de] MMMM")} • ${dayjs(startAt).format("h:mm a")}`
                  : "Sin fecha"}
              </Text>
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
    </Pressable>
  );
};

export default EventCard;
