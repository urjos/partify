import EventCard from "@/components/event/EventCard";
import EventMediaCarousel from "@/components/event/EventMediaCarousel";
import Header from "@/components/home/Header";
import Separator from "@/components/Separator";
import { EVENT_CATEGORIES } from "@/constants/categories";
import "@/global.css";
import { useEventStore } from "@/lib/store/eventStore";
import { useLocationPickerStore } from "@/lib/store/locationPickerStore";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

const CreateEvent = () => {
  const { user } = useUser();
  const addEvent = useEventStore((state) => state.addEvent);
  const pickedLocation = useLocationPickerStore(
    (state) => state.pickedLocation,
  );
  const clearPickedLocation = useLocationPickerStore(
    (state) => state.clearPickedLocation,
  );

  const [coverMediaList, setCoverMediaList] = useState<
    { uri: string; type: "image" | "video" }[]
  >([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState<{
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [unlimitedCapacity, setUnlimitedCapacity] = useState(true);
  const [capacity, setCapacity] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("");
  const [publishing, setPublishing] = useState(false);

  const MAX_MEDIA_ITEMS = 10;

  useEffect(() => {
    if (pickedLocation) {
      setLocation(pickedLocation);
      clearPickedLocation();
    }
  }, [pickedLocation]);

  const pickCoverMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Photo access needed",
        "Enable photo access in your device settings to add photos or videos.",
      );
      return;
    }

    const remainingSlots = MAX_MEDIA_ITEMS - coverMediaList.length;
    if (remainingSlots <= 0) {
      Alert.alert(
        "That's enough for now",
        `You can add up to ${MAX_MEDIA_ITEMS} photos or videos per event.`,
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
      videoMaxDuration: 30,
      quality: 0.8,
    });

    if (!result.canceled) {
      const picked = result.assets.map((asset) => ({
        uri: asset.uri,
        type: (asset.type === "video" ? "video" : "image") as "image" | "video",
      }));
      setCoverMediaList((prev) => [...prev, ...picked]);
    }
  };

  const removeCoverMedia = (index: number) => {
    setCoverMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDateChange = (_: unknown, selected?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selected) setDate(selected);
  };

  const handleTimeChange = (_: unknown, selected?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selected) setTime(selected);
  };

  const dateLabel =
    date && time
      ? `${formatDate(date)} · ${formatTime(time)}`
      : date
        ? formatDate(date)
        : null;

  const isValid = Boolean(
    title.trim() && description.trim() && date && time && location && category,
  );

  const previewEvent: EventItem | null = isValid
    ? {
        id: "preview",
        media:
          coverMediaList.length > 0
            ? coverMediaList.map((item) =>
                item.type === "video"
                  ? { type: "video" as const, uri: item.uri }
                  : { type: "image" as const, source: { uri: item.uri } },
              )
            : [
                {
                  type: "image" as const,
                  source: {
                    uri: `https://picsum.photos/seed/${encodeURIComponent(title)}/800/500`,
                  },
                },
              ],
        title: title.trim(),
        dateLabel: dateLabel!,
        location: location!.address,
        latitude: location!.latitude,
        longitude: location!.longitude,
        description: description.trim(),
        category: category!,
        author: user?.firstName || user?.fullName || "You",
        attendeeAvatars: [],
        attendeeCount: 0,
        interestedCount: 0,
        isGoing: true,
        isOwner: true,
      }
    : null;

  const handlePublish = () => {
    if (!isValid || !previewEvent) return;

    setPublishing(true);
    const newEvent: EventItem = {
      ...previewEvent,
      id: Date.now().toString(),
    };

    addEvent(newEvent);
    setPublishing(false);
    router.replace(`/(events)/${newEvent.id}`);
  };

  return (
    <SafeAreaView className="flex-1 page-all bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20"
      >
        <Header separator isPressable={false} title="New event" />

        <View className="mb-4">
          <View className="m-form-sec">
            <Text className="form-section-title">Photos & videos</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3"
            >
              {coverMediaList.map((item, index) => (
                <View key={item.uri + index} className="form-media-thumb">
                  <EventMediaCarousel
                    media={[
                      item.type === "video"
                        ? { type: "video", uri: item.uri }
                        : { type: "image", source: { uri: item.uri } },
                    ]}
                    className="form-media-thumb-media"
                  />
                  <Pressable
                    className="form-media-thumb-remove"
                    onPress={() => removeCoverMedia(index)}
                  >
                    <Ionicons name="close" size={14} color="#f5f4f2" />
                  </Pressable>
                </View>
              ))}

              {coverMediaList.length < MAX_MEDIA_ITEMS && (
                <Pressable
                  className="form-media-add-tile"
                  onPress={pickCoverMedia}
                >
                  <Ionicons name="add" size={22} color="#b24bfb" />
                </Pressable>
              )}
            </ScrollView>
            {coverMediaList.length === 0 && (
              <Text className="form-photo-picker-text mt-2">
                Add up to {MAX_MEDIA_ITEMS} photos or videos — the first one
                becomes the cover.
              </Text>
            )}
          </View>

          <Separator type="component" />

          <View className="auth-field mt-5">
            <Text className="form-section-title">Title</Text>
            <TextInput
              className="auth-input"
              placeholder="What's it called?"
              placeholderTextColor="rgba(245, 244, 242, 0.4)"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="auth-field mt-5">
            <Text className="form-section-title">Description</Text>
            <TextInput
              className="auth-input"
              placeholder="What should people know before they come?"
              placeholderTextColor="rgba(245, 244, 242, 0.4)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
            />
          </View>

          <View className="form-row m-form-sec-title">
            <Pressable
              className="form-picker-btn"
              onPress={() => setShowDatePicker(true)}
            >
              <View className="form-picker-icon-wrap">
                <Ionicons name="calendar-outline" size={17} color="#b24bfb" />
              </View>
              <View className="form-picker-text-wrap">
                <Text className="form-picker-label">Date</Text>
                <Text
                  className={
                    date ? "form-picker-value" : "form-picker-placeholder"
                  }
                >
                  {date ? formatDate(date) : "Select date"}
                </Text>
              </View>
            </Pressable>

            <Pressable
              className="form-picker-btn"
              onPress={() => setShowTimePicker(true)}
            >
              <View className="form-picker-icon-wrap">
                <Ionicons name="time-outline" size={17} color="#b24bfb" />
              </View>
              <View className="form-picker-text-wrap">
                <Text className="form-picker-label">Time</Text>
                <Text
                  className={
                    time ? "form-picker-value" : "form-picker-placeholder"
                  }
                >
                  {time ? formatTime(time) : "Select time"}
                </Text>
              </View>
            </Pressable>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date ?? new Date()}
              mode="date"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={time ?? new Date()}
              mode="time"
              onChange={handleTimeChange}
            />
          )}
        </View>

        <Separator type="component" />

        <View className="m-form-sec">
          <Text className="form-section-title">Location</Text>
          <Pressable
            className="form-picker-btn"
            onPress={() => router.push("/create-location")}
          >
            <View className="form-picker-icon-wrap">
              <Ionicons name="location-outline" size={17} color="#b24bfb" />
            </View>
            <View className="form-picker-text-wrap">
              <Text className="form-picker-label">Address</Text>
              <Text
                className={
                  location ? "form-picker-value" : "form-picker-placeholder"
                }
                numberOfLines={1}
              >
                {location ? location.address : "Set location on map"}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color="rgba(245, 244, 242, 0.4)"
            />
          </Pressable>
        </View>

        <Separator type="component" />

        <View className="m-form-sec">
          <Text className="form-section-title">Category</Text>
          <View className="form-chip-row">
            {EVENT_CATEGORIES.map((item) => {
              const active = category === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setCategory(active ? null : item)}
                  className={
                    active ? "form-chip form-chip-active" : "form-chip"
                  }
                >
                  <Text
                    className={
                      active
                        ? "form-chip-text form-chip-text-active"
                        : "form-chip-text"
                    }
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Separator type="component" />

        <View className="m-form-sec">
          <Text className="form-section-title">Extras</Text>

          <View className="form-toggle-row">
            <View className="flex w-65">
              <Text className="form-toggle-label">Unlimited capacity</Text>
              <Text className="form-toggle-sublabel">
                Make your party enable for everyone or not.
              </Text>
            </View>
            <Pressable onPress={() => setUnlimitedCapacity((prev) => !prev)}>
              <Ionicons
                name={unlimitedCapacity ? "toggle" : "toggle-outline"}
                size={54}
                color={unlimitedCapacity ? "#b24bfb" : "#6b6b76"}
              />
            </Pressable>
          </View>
          {!unlimitedCapacity && (
            <View className="form-field-extra">
              <View className="form-field-extra-sub">
                <Text className="form-section-subtitle">Capacity</Text>
                <TextInput
                  className="auth-input"
                  placeholder="e.g. 50"
                  placeholderTextColor="rgba(245, 244, 242, 0.4)"
                  value={capacity}
                  keyboardType="number-pad"
                  onChangeText={setCapacity}
                />
              </View>
            </View>
          )}

          <View className="form-toggle-row">
            <View className="flex w-65">
              <Text className="form-toggle-label">Free event</Text>
              <Text className="form-toggle-sublabel">
                Make your party free for everyone or not.
              </Text>
            </View>
            <Pressable onPress={() => setIsFree((prev) => !prev)}>
              <Ionicons
                className="transition ease-in"
                name={isFree ? "toggle" : "toggle-outline"}
                size={54}
                color={isFree ? "#b24bfb" : "#6b6b76"}
              />
            </Pressable>
          </View>
          {!isFree && (
            <View className="form-field-extra">
              <View className="form-field-extra-sub">
                <Text className="form-section-subtitle">Price</Text>
                <TextInput
                  className="auth-input"
                  placeholder="e.g. 15"
                  placeholderTextColor="rgba(245, 244, 242, 0.4)"
                  value={price}
                  keyboardType="decimal-pad"
                  onChangeText={setPrice}
                />
              </View>
            </View>
          )}
        </View>

        <Separator type="component" />

        <Text className="form-preview-label">Preview</Text>
        {previewEvent ? (
          <EventCard {...previewEvent} onPress={() => {}} />
        ) : (
          <View className="form-preview-empty">
            <Ionicons
              name="eye-outline"
              size={22}
              color="rgba(245, 244, 242, 0.4)"
            />
            <Text className="form-preview-empty-text">
              Fill in the required fields to see how your event will look.
            </Text>
          </View>
        )}

        <Pressable
          className={
            isValid
              ? "form-publish-btn"
              : "form-publish-btn form-publish-btn-disabled"
          }
          onPress={handlePublish}
          disabled={!isValid || publishing}
        >
          <Text className="form-publish-text">
            {publishing ? "Publishing..." : "Publish event"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateEvent;
