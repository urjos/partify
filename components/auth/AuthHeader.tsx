import React from "react";
import { Image, Text, View } from "react-native";

import partifyLogo from "@/assets/images/partify-logo.jpg";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <View className="auth-brand-block">
      <View className="auth-logo-wrap">
        <Image
          source={partifyLogo}
          className="auth-logo-mark"
          resizeMode="cover"
        />
        <View>
          <Text className="auth-wordmark">Partify</Text>
          <Text className="auth-wordmark-sub">Find what's happening</Text>
        </View>
      </View>
      <Text className="auth-title">{title}</Text>
      <Text className="auth-subtitle">{subtitle}</Text>
    </View>
  );
};

export default AuthHeader;
