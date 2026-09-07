import { icons } from "@/constants/icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface HeaderProps {
  title: string;
  isPressable: boolean;
  logo?: boolean;
  onPress?: () => void;
}

const Header = ({
  title,
  isPressable,
  logo,
  onPress,
}: HeaderProps) => {
  /*
  const { user } = useUser();
  const displayName = user?.firstName || user?.fullName || "User";
  */
  return (
    <>
      <View
        className="home-header w-full justify-between"
      >
        <View className="flex-row items-center gap-3">
          {logo && (
            <Image 
              source={icons.logowb2} 
              className="size-8" 
              resizeMode="contain" 
            />
          )}
          <Text className="home-brand-title">{title}</Text>
        </View>
        {isPressable && (
          <Pressable 
            onPress={onPress ?? (() => router.push("/(tabs)/create"))}
            className="p-2"
          >
            <Image 
              source={icons.plus} 
              className="size-8" 
              resizeMode="contain" 
            />
          </Pressable>
        )}
      </View>
    </>
  );
};

export default Header;
