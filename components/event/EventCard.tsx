import EventMediaCarousel from "@/components/event/EventMediaCarousel";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import { useApi } from "@/hooks/use-api";
import { useEventStore } from "@/lib/store/eventStore";
import { openWhatsApp } from "@/lib/whatsapp";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
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
  id,
  media,
  title,
  dateLabel,
  location,
  category,
  startAt,
  author,
  authorAvatar,
  rating,
  isFavorite: initialIsFavorite,
  contactMethod,
  contactPhone,
  externalTicketUrl,
  onPress,
  onContactPress,
  onToggleFavorite,
}: EventCardProps) => {
  const api = useApi();
  const toggleFavoriteAction = useEventStore((state) => state.toggleFavorite);
  const [isFavorite, setIsFavorite] = useState<boolean>(
    Boolean(initialIsFavorite),
  );

  useEffect(() => {
    setIsFavorite(Boolean(initialIsFavorite));
  }, [initialIsFavorite]);

  const handleFavoritePress = async (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
      return;
    }
    if (!id) return;
    const previous = isFavorite;
    setIsFavorite(!previous);
    try {
      const nextState = await toggleFavoriteAction(api, id);
      setIsFavorite(nextState);
    } catch {
      setIsFavorite(previous);
    }
  };

  const isExternal = contactMethod === "external" && Boolean(externalTicketUrl);

  const handleContactPress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    if (onContactPress) {
      onContactPress();
    } else if (isExternal) {
      Linking.openURL(externalTicketUrl!).catch(() => {});
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

      <View className="event-content page-all">
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
          <View className="gap-1 max-w-75">
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

          <View>
            <View className="event-actions-row">
              <Pressable
                className="event-contact-btn active:opacity-75"
                onPress={handleContactPress}
                hitSlop={8}
              >
                <Image
                  source={isExternal ? icons.ticket : icons.messageSquareText}
                  className="event-message-icon"
                  tintColor={colors.primary}
                  resizeMode="contain"
                />
              </Pressable>

              <Pressable
                className="event-bookmark-btn active:opacity-75"
                onPress={handleFavoritePress}
                hitSlop={8}
              >
                <Image
                  source={icons.heart}
                  className="event-bookmark-icon"
                  tintColor={isFavorite ? colors.accentPink : colors.primary}
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
