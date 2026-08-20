import AuthField from "@/components/auth/AuthField";
import EventCard from "@/components/event/EventCard";
import EventMedia from "@/components/event/EventMedia";
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

  const [coverMedia, setCoverMedia] = useState<{
    uri: string;
    type: "image" | "video";
  } | null>(null);
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

  useEffect(() => {
    if (pickedLocation) {
      setLocation(pickedLocation);
      clearPickedLocation();
    }
  }, [pickedLocation]);

  const pickCoverImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Photo access needed",
        "Enable photo access in your device settings to add a cover photo or video.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      videoMaxDuration: 30,
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setCoverMedia({
        uri: asset.uri,
        type: asset.type === "video" ? "video" : "image",
      });
    }
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
        image:
          coverMedia?.type === "image"
            ? { uri: coverMedia.uri }
            : {
                uri: `https://picsum.photos/seed/${encodeURIComponent(title)}/800/500`,
              },
        video: coverMedia?.type === "video" ? coverMedia.uri : undefined,
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
    router.replace(`/event/${newEvent.id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-4"
      >
        <Text className="mb-1 mt-2 text-3xl font-sans-bold text-primary">
          New event
        </Text>
        <Text className="text-sm font-sans-medium text-muted-foreground">
          Fill in the details, preview it, and publish when it's ready.
        </Text>

        <Text className="form-section-title">Cover photo or video</Text>
        <Pressable className="form-photo-picker" onPress={pickCoverImage}>
          {coverMedia ? (
            <>
              <EventMedia
                image={{ uri: coverMedia.uri }}
                video={coverMedia.type === "video" ? coverMedia.uri : undefined}
                className="form-photo-preview"
              />
              <Pressable
                className="form-photo-remove-btn"
                onPress={() => setCoverMedia(null)}
              >
                <Ionicons name="close" size={18} color="#f5f4f2" />
              </Pressable>
            </>
          ) : (
            <>
              <Ionicons name="camera-outline" size={26} color="#b24bfb" />
              <Text className="form-photo-picker-text">
                Add a cover photo or video
              </Text>
            </>
          )}
        </Pressable>

        <Text className="form-section-title">Details</Text>
        <AuthField
          label="Title"
          placeholder="What's it called?"
          value={title}
          onChangeText={setTitle}
        />
        <View className="auth-field">
          <Text className="auth-label">Description</Text>
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

        <Text className="form-section-title">Date & time</Text>
        <View className="form-row">
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

        <Text className="form-section-title">Category</Text>
        <View className="form-chip-row">
          {EVENT_CATEGORIES.map((item) => {
            const active = category === item;
            return (
              <Pressable
                key={item}
                onPress={() => setCategory(active ? null : item)}
                className={active ? "form-chip form-chip-active" : "form-chip"}
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

        <Text className="form-section-title">Extras (optional)</Text>
        <View className="form-toggle-row">
          <Text className="form-toggle-label">Unlimited capacity</Text>
          <Pressable onPress={() => setUnlimitedCapacity((prev) => !prev)}>
            <Ionicons
              name={unlimitedCapacity ? "toggle" : "toggle-outline"}
              size={34}
              color={unlimitedCapacity ? "#b24bfb" : "#6b6b76"}
            />
          </Pressable>
        </View>
        {!unlimitedCapacity && (
          <AuthField
            label="Capacity"
            placeholder="e.g. 50"
            keyboardType="number-pad"
            value={capacity}
            onChangeText={setCapacity}
          />
        )}

        <View className="form-toggle-row">
          <Text className="form-toggle-label">Free event</Text>
          <Pressable onPress={() => setIsFree((prev) => !prev)}>
            <Ionicons
              name={isFree ? "toggle" : "toggle-outline"}
              size={34}
              color={isFree ? "#b24bfb" : "#6b6b76"}
            />
          </Pressable>
        </View>
        {!isFree && (
          <AuthField
            label="Price (USD)"
            placeholder="e.g. 15"
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
          />
        )}

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
