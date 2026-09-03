import { useEffect, useRef } from "react";
import { Animated, ViewProps } from "react-native";

type SkeletonProps = ViewProps & {
  className: string;
};

const Skeleton = ({ className, style, ...props }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.75,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={className}
      style={[{ opacity, backgroundColor: "#212129" }, style]}
      {...props}
    />
  );
};

export default Skeleton;
