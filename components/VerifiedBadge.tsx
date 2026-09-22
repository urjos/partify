import { icons } from "@/constants/icons";
import clsx from "clsx";
import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

export interface VerifiedBadgeProps {
  isVerified?: boolean;
  size?: number;
  className?: string;
  style?: StyleProp<ImageStyle>;
  tintColor?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  isVerified = false,
  size = 16,
  className = "",
  style,
  tintColor,
}) => {
  if (!isVerified) {
    return null;
  }

  return (
    <Image
      source={icons.verified}
      resizeMode="contain"
      className={clsx("inline-block", className)}
      style={[
        { width: size, height: size },
        tintColor ? { tintColor } : null,
        style,
      ]}
      accessibilityLabel="Verified Pro Host"
    />
  );
};

export default VerifiedBadge;
