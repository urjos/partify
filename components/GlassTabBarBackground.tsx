import {
  BackdropBlur,
  Canvas,
  Fill,
  LinearGradient,
  rect,
  RoundedRect,
  rrect,
  vec,
} from "@shopify/react-native-skia";
import React, { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";

type GlassTabBarBackgroundProps = {
  radius: number;
  tintColor: string;
  brandTint?: string;
};

const GlassTabBarBackground = ({
  radius,
  tintColor,
  brandTint = "#b24bfb",
}: GlassTabBarBackgroundProps) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const clip = rrect(rect(0, 0, size.width, size.height), radius, radius);
  const outerRect = rrect(
    rect(0.5, 0.5, Math.max(size.width - 1, 0), Math.max(size.height - 1, 0)),
    radius,
    radius,
  );

  return (
    <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
      {size.width > 0 && (
        <Canvas style={StyleSheet.absoluteFill}>
          <BackdropBlur blur={18} clip={clip}>
            <Fill color={tintColor} />
          </BackdropBlur>

          {/* Lavado de marca: un violeta casi imperceptible, para que el
              vidrio se sienta "tuyo" y no un blur gris genérico */}
          <RoundedRect rect={clip} color={brandTint} opacity={0.06} />

          {/* Brillo del borde: más intenso arriba, se apaga hacia abajo —
              así es como la luz "engancha" el borde en vidrio real, en vez
              de un contorno parejo que se ve plano */}
          <RoundedRect rect={outerRect} style="stroke" strokeWidth={1}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, size.height)}
              colors={[
                "rgba(255,255,255,0.55)",
                "rgba(255,255,255,0.12)",
                "rgba(255,255,255,0.02)",
              ]}
            />
          </RoundedRect>
        </Canvas>
      )}
    </View>
  );
};

export default GlassTabBarBackground;
