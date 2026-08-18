import {
  BackdropBlur,
  Canvas,
  Fill,
  rect,
  rrect,
} from "@shopify/react-native-skia";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";

type GlassTabBarBackgroundProps = {
  radius: number;
  tintColor: string; // ej. "rgba(8, 17, 38, 0.45)"
};

const GlassTabBarBackground = ({
  radius,
  tintColor,
}: GlassTabBarBackgroundProps) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const clip = rrect(rect(0, 0, size.width, size.height), radius, radius);

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
      {size.width > 0 && (
        <Canvas style={StyleSheet.absoluteFill}>
          <BackdropBlur blur={14} clip={clip}>
            <Fill color={tintColor} />
          </BackdropBlur>
        </Canvas>
      )}
      {/* Highlight sutil del borde, encima del blur */}
      <View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: radius,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.18)",
        }}
      />
    </View>
  );
};

export default GlassTabBarBackground;
