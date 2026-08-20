import { icons } from "@/constants/icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const Header = () => {
  /*
  const { user } = useUser();
  const displayName = user?.firstName || user?.fullName || "User";
  */
  return (
    <>
      <View className="home-header">
        <Text className="home-brand-title">Partify</Text>
        <Pressable>
          <Image source={icons.ellipsis} className="home-icon-settings" />
        </Pressable>
      </View>
    </>
  );
};

export default Header;
