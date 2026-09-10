import back from "@/assets/icons/back.png";
import bookmark from "@/assets/icons/bookmark.png";
import clock from "@/assets/icons/clock.png";
import ellipsis from "@/assets/icons/ellipsis-vertical.png";
import filter from "@/assets/icons/filter.png";
import flame from "@/assets/icons/flame.png";
import home from "@/assets/icons/home.png";
import loader from "@/assets/icons/loader.png";
import mapPin from "@/assets/icons/map-pin.png";
import martini from "@/assets/icons/martini.png";
import messageSquareText from "@/assets/icons/message-square-text.png";
import navigation from "@/assets/icons/navigation.png";
import logowb from "@/assets/icons/partify-logo-2.png";
import logowb2 from "@/assets/icons/partify-logo-3.png";
import logo from "@/assets/icons/partify-logo.png";
import plus from "@/assets/icons/plus.png";
import right from "@/assets/icons/right.png";
import search from "@/assets/icons/search.png";
import setting from "@/assets/icons/setting.png";
import star from "@/assets/icons/star.png";
import user from "@/assets/icons/user.png";
import verified from "@/assets/icons/verified.png";
import x from "@/assets/icons/x.png";

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
  messageSquareText,
  navigation,
  bookmark,
  star,
  verified,
  clock,
  back,
  x,
  filter,
  flame,
  martini,
  right,
  mapPin,
  loader,
} as const;

export type IconKey = keyof typeof icons;
