import clsx from "clsx";
import React from "react";
import { Pressable, Text, View } from "react-native";

export type ProfileTab = "favorites" | "history";

interface ProfileSegmentedTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export default function ProfileSegmentedTabs({
  activeTab,
  onTabChange,
}: ProfileSegmentedTabsProps) {
  return (
    <View className="bg-modal-background/60 p-1 rounded-full flex-row items-center border-none">
      <Pressable
        onPress={() => onTabChange("favorites")}
        className={clsx(
          "flex-1 py-2.5 rounded-full items-center justify-center transition-all",
          activeTab === "favorites"
            ? "bg-modal-background border-none"
            : "bg-transparent",
        )}
      >
        <Text
          className={clsx(
            "text-sm",
            activeTab === "favorites"
              ? "font-semibold text-primary"
              : "font-medium text-muted-foreground",
          )}
        >
          Favoritas
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onTabChange("history")}
        className={clsx(
          "flex-1 py-2.5 rounded-full items-center justify-center transition-all",
          activeTab === "history"
            ? "bg-modal-background border-none"
            : "bg-transparent",
        )}
      >
        <Text
          className={clsx(
            "text-sm",
            activeTab === "history"
              ? "font-semibold text-primary"
              : "font-medium text-muted-foreground",
          )}
        >
          Historial
        </Text>
      </Pressable>
    </View>
  );
}
