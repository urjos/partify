import clsx from "clsx";
import { Image, Text, View } from "react-native";

const AvatarStack = ({
  avatars,
  count,
  maxVisible = 3,
  size = "sm",
}: AvatarStackProps) => {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const extraCount = count - visibleAvatars.length;

  return (
    <View className="avatar-stack">
      {visibleAvatars.map((avatar, index) => (
        <Image
          key={index}
          source={avatar}
          className={clsx(
            "avatar-stack-item",
            size === "md" && "avatar-stack-item-md",
          )}
        />
      ))}
      {extraCount > 0 ? (
        <Text className="avatar-stack-count">+{extraCount}</Text>
      ) : null}
    </View>
  );
};

export default AvatarStack;
