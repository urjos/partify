import { icons } from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

export default function LocationFilter() {
  return (
    <View className="home-location-wrap">
      <Pressable className="home-location-btn">
        <Image
          source={icons.navigation}
          className="home-location-icon"
          tintColor="#fefefe"
          resizeMode="contain"
        />
        <Text className="home-location-text">Madrid · 5 km</Text>
        <Ionicons name="chevron-down" size={16} color="#9ca3af" />
      </Pressable>
    </View>
  );
}
