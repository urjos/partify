import ellipsis from "@/assets/icons/ellipsis-vertical.png";
import home from "@/assets/icons/home.png";
import logowb from "@/assets/icons/partify-logo-2.png";
import logowb2 from "@/assets/icons/partify-logo-3.png";
import logo from "@/assets/icons/partify-logo.png";
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
  logo,
  logowb,
  logowb2,
} as const;

export type IconKey = keyof typeof icons;
