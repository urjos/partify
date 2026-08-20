import ellipsis from "@/assets/icons/ellipsis-vertical.png";
import home from "@/assets/icons/home.png";
import plus from "@/assets/icons/plus.png";
import search from "@/assets/icons/search.png";
import setting from "@/assets/icons/setting.png";
import user from "@/assets/icons/user.png";

export const icons = {
  home,
  setting,
  search,
  user,
  plus,
  ellipsis,
} as const;

export type IconKey = keyof typeof icons;
