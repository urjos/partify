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
  attendeeAvatars,
  attendeeCount,
  isGoing,
  onPress,
}: EventCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="event-card relative overflow-hidden rounded-[32px] bg-card mt-6"
    >
      <View className="relative h-[500px] w-full">
        {/* Background Image/Carousel */}
        <EventMediaCarousel
          media={media}
          className="absolute inset-0 h-full w-full"
          onPress={onPress}
        />

        {/* Dark Overlays for text readability */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,1)"]}
          locations={[0.3, 0.7, 1]}
          className="absolute inset-0"
          pointerEvents="none"
        />

        {/* Content Wrapper */}
        <View className="absolute bottom-0 left-0 right-0 p-5 pb-6">
          {/* Category & Location */}
          <View className="flex-row items-center gap-3 mb-2">
            <View className="bg-accent px-3 py-1 rounded-xl">
              <Text className="text-xs font-sans-bold text-background uppercase tracking-[0.5px]">
                {category}
              </Text>
            </View>
            <Text className="text-base font-sans-medium text-gray-200">
              {distanceLabel || location}
            </Text>
          </View>

          {/* Title */}
          <Text
            numberOfLines={2}
            className="text-3xl font-sans-bold text-white mb-4"
          >
            {title}
          </Text>

          {/* Meta & Actions */}
          <View className="flex-row items-end justify-between">
            {/* Left: Author & Time */}
            <View className="gap-2">
              <View className="flex-row items-center gap-1.5">
                <Image
                  source={icons.verified}
                  className="size-4"
                  tintColor="#ea4bc8"
                  resizeMode="contain"
                />
                <Text className="text-sm font-sans-medium text-gray-200">
                  {author}
                </Text>
                <View>
                  <Text className="text-sm font-sans-bold text-accent-pink ml-1">
                    4.9
                  </Text>
                  <Image
                    source={icons.star}
                    className="size-4"
                    tintColor="#ea4bc8"
                    resizeMode="contain"
                  />
                </View>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Image
                  source={icons.clock}
                  className="size-4"
                  tintColor="#d1d5db"
                  resizeMode="contain"
                />
                <Text className="text-sm font-sans-medium text-gray-300">
                  {dateLabel}
                </Text>
              </View>
            </View>

            {/* Right: Actions */}
            <View className="flex-row items-center gap-3">
              <Pressable className="flex-row items-center gap-2 bg-[#2c2c2e]/90 px-4 py-3 rounded-full">
                <Image
                  source={icons.messageSquareText}
                  className="size-4"
                  tintColor="#e5e7eb"
                  resizeMode="contain"
                />
                <Text className="text-sm font-sans-bold text-gray-200">
                  Contactar
                </Text>
              </Pressable>
              <Pressable className="bg-[#1c1c1e]/90 p-3 rounded-full">
                <Image
                  source={icons.bookmark}
                  className="size-5"
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
