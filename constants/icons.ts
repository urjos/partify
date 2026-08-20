import home from "@/assets/icons/home.png";
import medium from "@/assets/icons/medium.png";
import search from "@/assets/icons/search.png";
import setting from "@/assets/icons/setting.png";
import user from "@/assets/icons/user.png";

export const icons = {
  home,
  setting,
  medium,
  search,
  user,
} as const;

export type IconKey = keyof typeof icons;
