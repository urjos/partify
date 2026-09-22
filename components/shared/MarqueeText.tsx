import { colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import VerifiedBadge from "../VerifiedBadge";

export interface MarqueeTextProps {
  text: string;
  className?: string;
  style?: StyleProp<TextStyle>;
  containerClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
  fadeColor?: string;
  fadeWidth?: number;
  speed?: number; // ms per pixel (default: 35)
  delay?: number; // pause in ms before moving and at the end (default: 1500)
  initial?: boolean;
  verifiedIcon?: boolean;
  authorIsVerified?: boolean;
  badgeSize?: number;
}

export default function MarqueeText({
  text,
  className,
  style,
  containerClassName,
  containerStyle,
  initial,
  maxWidth,
  verifiedIcon,
  authorIsVerified,
  badgeSize = 14,
  fadeColor = colors.background,
  fadeWidth = 28,
  speed = 35,
  delay = 1500,
}: MarqueeTextProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const shouldShowBadge = Boolean(authorIsVerified ?? verifiedIcon);
  const cleanText = (text || "").replace(/[\r\n\t]+/g, " ").trim();

  // Reset textWidth when text or badge changes
  useEffect(() => {
    setTextWidth(0);
    translateX.setValue(0);
  }, [cleanText, shouldShowBadge, translateX]);

  // Ancho efectivo del contenedor
  const effectiveWidth = maxWidth
    ? Math.min(containerWidth || maxWidth, maxWidth)
    : containerWidth;

  const isOverflowing =
    effectiveWidth > 0 && textWidth > 0 && textWidth > effectiveWidth + 2;
  const overflowDistance = isOverflowing
    ? textWidth - effectiveWidth + fadeWidth
    : 0;

  useEffect(() => {
    if (!isOverflowing || overflowDistance <= 0) {
      translateX.setValue(0);
      return;
    }

    const duration = Math.max(2000, overflowDistance * speed);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateX, {
          toValue: -overflowDistance,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(delay),
        Animated.timing(translateX, {
          toValue: 0,
          duration: Math.min(1000, duration * 0.5),
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
      translateX.setValue(0);
    };
  }, [isOverflowing, overflowDistance, speed, delay, translateX]);

  return (
    <View
      className={containerClassName ?? "w-full overflow-hidden relative"}
      style={[
        maxWidth ? { maxWidth } : null,
        containerStyle,
        { overflow: "hidden" },
      ]}
      onLayout={(e) => {
        const width = Math.floor(e.nativeEvent.layout.width);
        if (width > 0 && Math.abs(width - containerWidth) > 1) {
          setContainerWidth(width);
        }
      }}
    >
      {/* Medidor invisible de texto + badge en un contenedor amplio para que Android no lo colapse ni lo trunque */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 9999,
          opacity: 0,
          flexDirection: "row",
        }}
        pointerEvents="none"
        collapsable={false}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
          }}
          onLayout={(e) => {
            const w = Math.ceil(e.nativeEvent.layout.width);
            if (w > 0) {
              setTextWidth((prev) => (Math.abs(prev - w) > 1 ? w : prev));
            }
          }}
        >
          <Text
            className={className}
            style={[style, { alignSelf: "flex-start", flexShrink: 0 }]}
            ellipsizeMode="clip"
          >
            {cleanText}
          </Text>
          {shouldShowBadge && (
            <View style={{ marginLeft: 4 }}>
              <VerifiedBadge
                isVerified={true}
                size={badgeSize}
                tintColor={colors.accentPink}
              />
            </View>
          )}
        </View>
      </View>

      <Animated.View
        style={{
          transform: [{ translateX }],
          flexDirection: "row",
          alignItems: "center",
          width:
            textWidth > 0
              ? Math.max(effectiveWidth, textWidth + fadeWidth + 30)
              : 9999,
        }}
      >
        <Text
          className={className}
          style={[style, { flexShrink: 0 }]}
          ellipsizeMode="clip"
        >
          {cleanText}
        </Text>
        {shouldShowBadge && (
          <View style={{ marginLeft: 4 }}>
            <VerifiedBadge
              isVerified={true}
              size={badgeSize}
              tintColor={colors.accentPink}
            />
          </View>
        )}
      </Animated.View>

      {/* Gradiente de desvanecimiento visual en el inicio (borde izquierdo) */}
      {isOverflowing && initial && (
        <LinearGradient
          colors={[fadeColor, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: fadeWidth,
            zIndex: 10,
          }}
          pointerEvents="none"
        />
      )}

      {/* Gradiente de desvanecimiento visual en el final (borde derecho) */}
      {isOverflowing && (
        <LinearGradient
          colors={["transparent", fadeColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: fadeWidth,
            zIndex: 10,
          }}
          pointerEvents="none"
        />
      )}
    </View>
  );
}
