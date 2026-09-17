import { colors } from "@/constants/theme";
import { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";

type AnimatedToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 30;
const KNOB_SIZE = 24;
const KNOB_MARGIN = 2;

const AnimatedToggle = ({
  value,
  onValueChange,
  disabled = false,
}: AnimatedToggleProps) => {
  const isChecked = value && !disabled;
  const progress = useRef(new Animated.Value(isChecked ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: isChecked ? 1 : 0,
      useNativeDriver: false,
      bounciness: 6,
      speed: 18,
    }).start();
  }, [isChecked, progress]);

  const knobTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [KNOB_MARGIN, TRACK_WIDTH - KNOB_SIZE - KNOB_MARGIN - 2],
  });

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.modalBackground, colors.accentPink],
  });

  const borderColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.card, colors.accentPink],
  });

  return (
    <Pressable
      onPress={() => {
        if (!disabled) {
          onValueChange(!value);
        }
      }}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: isChecked, disabled }}
      style={{ opacity: disabled ? 0.4 : 1 }}
    >
      <Animated.View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_HEIGHT / 2,
          backgroundColor: trackColor,
          borderColor,
          borderWidth: 1,
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={{
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: KNOB_SIZE / 2,
            backgroundColor: colors.primary,
            transform: [{ translateX: knobTranslateX }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedToggle;
