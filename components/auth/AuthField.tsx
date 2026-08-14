import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

import { colors } from "@/constants/theme";

type AuthFieldProps = TextInputProps & {
  label: string;
  error?: string | null;
};

const AuthField = ({ label, error, ...inputProps }: AuthFieldProps) => {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      <TextInput
        className={`auth-input ${error ? "auth-input-error" : ""}`}
        placeholderTextColor={colors.mutedForeground}
        autoCapitalize="none"
        autoCorrect={false}
        {...inputProps}
      />
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
};

export default AuthField;
