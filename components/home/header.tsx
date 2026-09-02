import { icons } from "@/constants/icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import Separator from "../Separator";

interface HeaderProps {
  title: string;
  isPressable: boolean;
  separator: boolean;
}

const Header = ({ title, isPressable, separator }: HeaderProps) => {
  /*
  const { user } = useUser();
  const displayName = user?.firstName || user?.fullName || "User";
  */
  return (
    <>
      <View
        className={`
        ${separator ? "home-header" : "mb-5 home-header"} 
      `}
      >
        {/*}<Image source={icons.logowb} className="auth-logo" />{*/}
        <Text className="home-brand-title">{title}</Text>
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
