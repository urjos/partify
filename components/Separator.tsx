import React from "react";
import { View } from "react-native";

interface SeparatorProps {
  type: "component" | "header" | null;
}

const Separator = ({ type }: SeparatorProps) => {
  return (
    <View
      className={`
        ${type === "component" ? "separator-component" : ""} 
        ${type === "header" ? "separator" : ""}
      `}
    />
  );
};

export default Separator;
