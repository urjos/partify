import { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";

type AnimatedToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 30;
const KNOB_SIZE = 24;
const KNOB_MARGIN = 3;

const AnimatedToggle = ({ value, onValueChange }: AnimatedToggleProps) => {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      bounciness: 6,
      speed: 16,
    }).start();
  }, [value, progress]);

  const knobTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [KNOB_MARGIN, TRACK_WIDTH - KNOB_SIZE - KNOB_MARGIN],
  });

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["#2a2a33", "#b24bfb"],
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          backgroundColor: trackColor,
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: KNOB_SIZE / 2,
            backgroundColor: "#f5f4f2",
            transform: [{ translateX: knobTranslateX }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedToggle;