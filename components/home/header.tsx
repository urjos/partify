import { icons } from "@/constants/icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import Separator from "../Separator";

interface HeaderProps {
  title: string;
  isPressable: boolean;
  separator: boolean;
  logo?: boolean;
}

const Header = ({ title, isPressable, separator, logo }: HeaderProps) => {
  /*
  const { user } = useUser();
  const displayName = user?.firstName || user?.fullName || "User";
  */
  return (
    <>
      <View
        className={`
        ${separator ? "home-header justify-between" : "mb-5 home-header"} 
      `}
      >
        <View className="flex-row items-center gap-3">
          {logo && <Image source={icons.logowb2} className="home-logo" />}
          <Text className="home-brand-title">{title}</Text>
        </View>
        {isPressable && (
          <Pressable>
            <Image source={icons.ellipsis} className="home-icon-settings" />
          </Pressable>
        )}
      </View>
      {separator && <Separator type="header" />}
    </>
  );
};

export default Header;
