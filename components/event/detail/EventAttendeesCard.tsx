import images from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

interface EventAttendeesCardProps {
  attendeeCount: number;
  attendeeAvatars?: ImageSourcePropType[];
  onPress?: () => void;
}

export default function EventAttendeesCard({
  attendeeCount,
  attendeeAvatars = [],
  onPress,
}: EventAttendeesCardProps) {
  const displayCount = Math.max(attendeeCount, 0);

  return (
    <Pressable
      onPress={onPress}
      className="bg-modal-background rounded-2xl p-4 flex-row items-center justify-between active:opacity-80"
    >
      <View className="flex-row items-center gap-3.5 flex-1 pr-2">
        {/* Avatar Stack */}
        <View className="flex-row items-center">
          {attendeeAvatars.slice(0, 3).map((avatar, idx) => (
            <Image
              key={idx}
              source={avatar}
              className="size-8 rounded-full"
              style={{ marginLeft: idx > 0 ? -10 : 0 }}
            />
          ))}
          {attendeeAvatars.length === 0 && (
            <Image source={images.avatar} className="size-8 rounded-full" />
          )}
          <View
            className="size-8 rounded-full bg-[#381f3b] items-center justify-center"
            style={{ marginLeft: attendeeAvatars.length > 0 ? -10 : -6 }}
          >
            <Text className="text-[10px] font-black text-accent-pink">
              +{displayCount > 0 ? displayCount : 1}
            </Text>
          </View>
        </View>

        {/* Texto Social */}
        <View className="flex-1">
          <Text className="text-sm font-bold text-primary" numberOfLines={1}>
            +{displayCount > 0 ? displayCount : 1} personas asistirán
          </Text>
          <Text
            className="text-xs text-muted-foreground mt-0.5"
            numberOfLines={1}
          >
            {displayCount > 0
              ? `${displayCount} personas confirmaron asistencia`
              : "Sé el primero en confirmar"}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="rgba(245, 244, 242, 0.4)"
      />
    </Pressable>
  );
}
