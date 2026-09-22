import EventMediaCarousel from "@/components/event/EventMediaCarousel";
import MarqueeText from "@/components/shared/MarqueeText";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { colors } from "@/constants/theme";
import { useApi } from "@/hooks/use-api";
import { useBilling } from "@/hooks/use-billing";
import { useEventStore } from "@/lib/store/eventStore";
import { formatDateProfile, locationFormattedDistrict } from "@/lib/utils";
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
import VerifiedBadge from "../VerifiedBadge";

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
  const { hasVerifiedBadge } = useBilling();

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
              {locationFormattedDistrict(location)}
            </Text>
          </View>
          <View className="event-meta-row">
            <Text className="event-time-text">
              {formatDateProfile(startAt)}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center">
          <View className="gap-1">
            <View className="flex-row items-center gap-2">
              <MarqueeText
                text={title}
                className="event-title"
                containerClassName="max-w-80"
              />
            </View>

            <View className="flex-row items-center gap-1">
              <Image
                source={authorAvatar ? { uri: authorAvatar } : images.avatar}
                className="w-4 h-4 rounded-full"
              />
              <Text className="event-meta-text">{author}</Text>
              <VerifiedBadge
                isVerified={hasVerifiedBadge}
                size={14}
                tintColor={colors.accentPink}
              />
            </View>
          </View>

          <View className="event-actions-row">
            <Pressable
              className={`size-10 items-center justify-center overflow-hidden rounded-full active:opacity-75 ${
                isFavorite ? "bg-transparent" : "bg-card"
              }`}
              onPress={handleFavoritePress}
              hitSlop={8}
            >
              <Image
                source={isFavorite ? icons.heartSolid : icons.heart}
                className="size-6"
                tintColor={colors.accentPink}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default EventCard;
