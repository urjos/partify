import EventMediaCarousel from "@/components/event/EventMediaCarousel";
import Separator from "@/components/Separator";
import "@/global.css";
import { useEventStore } from "@/lib/store/eventStore";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ICON_COLOR = "#f5f4f2";

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const events = useEventStore((state) => state.events);
  const event = events.find((item) => item.id === id);

  const [status, setStatus] = useState<AttendanceStatus>(
    event?.isGoing ? "going" : null,
  );

  if (!event) {
    return (
      <SafeAreaView className="event-detail-empty">
        <Ionicons name="calendar-outline" size={32} color={ICON_COLOR} />
        <Text className="event-detail-empty-text">
          We couldn't find this event. It may have been removed or cancelled.
        </Text>
        <Pressable
          className="auth-secondary-button"
          onPress={() => router.back()}
        >
          <Text className="auth-secondary-button-text">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isOwner = event.isOwner ?? false;
  const goingCount = event.attendeeCount + (status === "going" ? 1 : 0);
  const interestedCount =
    event.interestedCount + (status === "interested" ? 1 : 0);

  const toggleStatus = (next: Exclude<AttendanceStatus, null>) => {
    setStatus((current) => (current === next ? null : next));
  };

  const openInMaps = () => {
    const query = encodeURIComponent(event.location);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://maps.google.com/?q=${query}`,
    });
    if (url) Linking.openURL(url).catch(() => {});
  };

  const staticMapUrl =
    `https://staticmap.openstreetmap.de/staticmap.php` +
    `?center=${event.latitude},${event.longitude}` +
    `&zoom=15&size=600x300`;

  const confirmCancel = () => {
    Alert.alert(
      "Cancel this event?",
      "Attendees will be notified that it's no longer happening. This can't be undone.",
      [
        { text: "Keep event", style: "cancel" },
        {
          text: "Cancel event",
          style: "destructive",
          onPress: () => router.back(),
        },
      ],
    );
  };

  return (
    <View className="event-detail-container">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20"
      >
        <View className="event-detail-header">
          <EventMediaCarousel
            media={event.media}
            className="event-detail-image"
          />
          <SafeAreaView>
            <View className="event-detail-nav-row mt-2">
              <Pressable
                onPress={() => router.back()}
                className="event-detail-icon-btn"
              >
                <BlurView
                  intensity={40}
                  tint="dark"
                  style={StyleSheet.absoluteFill}
                />
                <Ionicons name="chevron-back" size={22} color={ICON_COLOR} />
              </Pressable>

              <Pressable
                onPress={() =>
                  Alert.alert("Share", "Sharing isn't wired up yet.")
                }
                className="event-detail-icon-btn"
              >
                <BlurView
                  intensity={40}
                  tint="dark"
                  style={StyleSheet.absoluteFill}
                />
                <Ionicons name="share-outline" size={20} color={ICON_COLOR} />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View className="event-detail-card">
          <View className="event-detail-category-chip">
            <Text className="event-detail-category-text">{event.category}</Text>
          </View>

          <Text className="event-detail-title">{event.title}</Text>

          <Separator type={"header"} />

          <Text className="event-detail-section-title">About this event</Text>
          <Text className="event-detail-description">{event.description}</Text>

          <View className="event-detail-info-row">
            <View className="event-detail-info-icon-wrap">
              <Ionicons name="calendar-outline" size={17} color="#b24bfb" />
            </View>
            <View className="event-detail-info-text-wrap">
              <Text className="event-detail-info-label">{event.dateLabel}</Text>
              {event.distanceLabel ? (
                <Text className="event-detail-info-sub">
                  {event.distanceLabel}
                </Text>
              ) : null}
            </View>
          </View>

          <Pressable className="event-detail-info-row" onPress={openInMaps}>
            <View className="event-detail-info-icon-wrap">
              <Ionicons name="location-outline" size={17} color="#b24bfb" />
            </View>
            <View className="event-detail-info-text-wrap">
              <Text className="event-detail-info-label" numberOfLines={1}>
                {event.location}
              </Text>
              <Text className="event-detail-info-sub">Tap to open in Maps</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="rgba(245, 244, 242, 0.4)"
            />
          </Pressable>

          {/*}
          <Pressable className="event-detail-map-wrap" onPress={openInMaps}>
            <Image
              source={{ uri: staticMapUrl }}
              className="event-detail-map-image"
              resizeMode="cover"
            />
            <View className="event-detail-map-pin">
              <Ionicons name="location" size={18} color="#f5f4f2" />
            </View>
            <View className="event-detail-map-label">
              <Text className="event-detail-map-label-text">Open in Maps</Text>
            </View>
          </Pressable>
          {*/}

          <View className="event-detail-attendance-row">
            <Text className="event-detail-attendance-text">
              {goingCount} going · {interestedCount} interested
            </Text>
          </View>

          <Text className="event-detail-section-title">Comments</Text>
          <View className="event-detail-comments-placeholder">
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color="rgba(245, 244, 242, 0.4)"
            />
            <Text className="event-detail-comments-placeholder-text">
              Comments are coming in a future update.
            </Text>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]}>
        <View className="event-detail-action-bar">
          {isOwner ? (
            <View className="event-detail-owner-row">
              <Pressable
                className="event-detail-edit-btn"
                onPress={() => () =>
                  router.push(`/(events)/(edit)/${event.id}`)
                }
              >
                <Text className="event-detail-edit-btn-text">Edit</Text>
              </Pressable>

              <Pressable
                className="event-detail-cancel-btn"
                onPress={confirmCancel}
              >
                <Text className="event-detail-cancel-btn-text">
                  Cancel event
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="event-detail-segment">
              <Pressable
                onPress={() => toggleStatus("going")}
                className={
                  status === "going"
                    ? "event-detail-segment-btn event-detail-segment-btn-active"
                    : "event-detail-segment-btn"
                }
              >
                <Text
                  className={
                    status === "going"
                      ? "event-detail-segment-btn-text event-detail-segment-btn-text-active"
                      : "event-detail-segment-btn-text"
                  }
                >
                  I'm going
                </Text>
              </Pressable>
              <Pressable
                onPress={() => toggleStatus("interested")}
                className={
                  status === "interested"
                    ? "event-detail-segment-btn event-detail-segment-btn-active"
                    : "event-detail-segment-btn"
                }
              >
                <Text
                  className={
                    status === "interested"
                      ? "event-detail-segment-btn-text event-detail-segment-btn-text-active"
                      : "event-detail-segment-btn-text"
                  }
                >
                  Interested
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
