import EventMediaCarousel from "@/components/event/EventMediaCarousel";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import { openWhatsApp } from "@/lib/whatsapp";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LinearGradient } from "expo-linear-gradient";
import {
  GestureResponderEvent,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from "react-native";

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
  paymentMethod,
  contactPhone,
  externalTicketUrl,
  onPress,
  onContactPress,
}: EventCardProps) => {
  const handleContactPress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (onContactPress) {
      onContactPress();
    } else if (paymentMethod === "external" && externalTicketUrl) {
      Linking.openURL(externalTicketUrl).catch(() => {});
    } else {
      openWhatsApp(contactPhone, title);
    }
  };
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
        <View className="flex-row justify-between">
          <View className="event-header-row">
            <View className="event-category-chip">
              <Text className="event-category-text">{category}</Text>
            </View>
            <Text numberOfLines={1} className="event-location-text">
              {location?.split(",").slice(-2, -1)[0]?.trim() || location}
            </Text>
          </View>
          <View className="event-meta-row">
            <Text className="event-time-text">
              {`${dayjs(startAt).format("D/M")} - ${dayjs(startAt).format("h:mm a")}`}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center">
          <View className="gap-1">
            <View className="flex-row items-center gap-2">
              {/* Maximo de 30 caracteres para titulo*/}
              <Text numberOfLines={1} className="event-title">
                {title}
              </Text>
              {rating && rating > 0 ? (
                <View className="event-rating-row">
                  <Text className="event-rating-text">{rating}</Text>
                  <Image
                    source={icons.star}
                    className="event-meta-icon"
                    tintColor={colors.accentPink}
                    resizeMode="contain"
                  />
                </View>
              ) : null}
            </View>
            <View className="event-meta-stack">
              <View className="flex-row items-center gap-2">
                <Image
                  source={authorAvatar ? { uri: authorAvatar } : images.avatar}
                  className="w-4 h-4 rounded-full"
                />
                <Text className="event-meta-text">{author}</Text>
                <Image
                  source={icons.verified}
                  className="event-meta-icon"
                  tintColor={colors.accentPink}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>

          <View>
            <View className="event-actions-row">
              <Pressable
                className="event-contact-btn active:opacity-75"
                onPress={handleContactPress}
                hitSlop={8}
              >
                <Image
                  source={icons.messageSquareText}
                  className="event-message-icon"
                  tintColor={colors.primary}
                  resizeMode="contain"
                />
              </Pressable>

              <Pressable className="event-bookmark-btn">
                <Image
                  source={icons.heart}
                  className="event-bookmark-icon"
                  tintColor={colors.primary}
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
