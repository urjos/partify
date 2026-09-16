import { icons } from "@/constants/icons";
import { colors } from "@/constants/theme";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { Marker } from "react-native-maps";

export interface EventMarkerProps {
  event: any;
  onPress?: () => void;
}

const EventMarker = React.memo(function EventMarker({
  event,
  onPress,
}: EventMarkerProps) {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Marker
      coordinate={{
        latitude: event.latitude,
        longitude: event.longitude,
      }}
      tracksViewChanges={tracksViewChanges}
      onPress={onPress}
    >
      <View className="size-8 rounded-full bg-card items-center justify-center shadow-lg border border-border/40">
        <Image
          source={icons.flame}
          className="size-4"
          tintColor={colors.destructive}
          resizeMode="contain"
        />
      </View>
    </Marker>
  );
});

export default EventMarker;
