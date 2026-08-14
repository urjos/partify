import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import { colors } from "@/constants/theme";

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

const AuthButton = ({ label, onPress, loading, disabled }: AuthButtonProps) => {
  const isDisabled = Boolean(disabled) || Boolean(loading);

  return (
    <TouchableOpacity
      className={`auth-button ${isDisabled ? "auth-button-disabled" : ""}`}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text className="auth-button-text">{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default AuthButton;
