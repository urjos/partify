import React from "react";
import { Text, View } from "react-native";

const Header = () => {
  /*
  const { user } = useUser();
  const displayName = user?.firstName || user?.fullName || "User";
  */
  return (
    <>
      <View className="home-header">
        <View className="home-title">
          <Text className="home-brand">Partify</Text>
        </View>
      </View>
    </>
  );
};

export default Header;
