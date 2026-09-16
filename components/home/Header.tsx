import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface HeaderProps {
  title: string;
  isPressable: boolean;
  logo?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  className?: string;
  isIconClose?: boolean;
}

const Header = ({
  title,
  isPressable,
  logo,
  onPress,
  className,
  isIconClose,
  onClose,
}: HeaderProps) => {
  /*
  const { user } = useUser();
  const displayName = user?.firstName || user?.fullName || "User";
  */
  return (
    <>
      <View className={`${className} home-header w-full justify-between py-2`}>
        <View className="flex-row items-center gap-2">
          {logo && (
            <Image
              source={icons.logowb2}
              className="size-6"
              resizeMode="contain"
            />
          )}
          <Text className="home-brand-title">{title}</Text>
        </View>
        {isPressable && (
          <Pressable
            onPress={onPress ?? (() => router.push("/(tabs)/create"))}
            className=""
          >
            <Image
              source={icons.plus}
              className="size-8"
              resizeMode="contain"
            />
          </Pressable>
        )}
        {isIconClose && (
          <Pressable
            onPress={onClose}
            hitSlop={10}
            className="size-9 rounded-full items-center justify-center active:opacity-75"
          >
            <Image
              source={icons.x}
              className="size-6"
              tintColor={colors.mutedForeground}
              resizeMode="contain"
            />
          </Pressable>
        )}
      </View>
    </>
  );
};

export default Header;
