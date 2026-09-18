import audioLines from "@/assets/icons/audio-lines.png";
import back from "@/assets/icons/back.png";
import bookmark from "@/assets/icons/bookmark.png";
import spotify from "@/assets/icons/brands/spotify.png";
import whatsapp from "@/assets/icons/brands/whatsapp.png";
import calendar from "@/assets/icons/calendar.png";
import cameraAdd from "@/assets/icons/camera-add.png";
import carFront from "@/assets/icons/car-front.png";
import chevronDown from "@/assets/icons/chevron-down.png";
import checkCircle from "@/assets/icons/circle-check.png";
import clock from "@/assets/icons/clock.png";
import clothes from "@/assets/icons/clothes.png";
import ellipsis from "@/assets/icons/ellipsis-vertical.png";
import filter from "@/assets/icons/filter.png";
import flame from "@/assets/icons/flame.png";
import heartSolid from "@/assets/icons/heart-solid.png";
import heart from "@/assets/icons/heart.png";
import home from "@/assets/icons/home.png";
import link from "@/assets/icons/link.png";
import loader from "@/assets/icons/loader.png";
import mapPin from "@/assets/icons/map-pin.png";
import martini from "@/assets/icons/martini.png";
import messageSquareText from "@/assets/icons/message-square-text.png";
import minus from "@/assets/icons/minus.png";
import moon from "@/assets/icons/moon.png";
import navigation from "@/assets/icons/navigation.png";
import logowb from "@/assets/icons/partify-logo-2.png";
import logowb2 from "@/assets/icons/partify-logo-3.png";
import logo from "@/assets/icons/partify-logo.png";
import paymentMethod from "@/assets/icons/payment-method.png";
import pencil from "@/assets/icons/pencil.png";
import phone from "@/assets/icons/phone.png";
import plus from "@/assets/icons/plus.png";
import qrCode from "@/assets/icons/qr-code.png";
import right from "@/assets/icons/right.png";
import search from "@/assets/icons/search.png";
import setting from "@/assets/icons/setting.png";
import shield from "@/assets/icons/shield.png";
import star from "@/assets/icons/star.png";
import ticket from "@/assets/icons/ticket.png";
import uber from "@/assets/icons/uber.png";
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
  minus,
  chevronDown,
  calendar,
  moon,
  pencil,
  qrCode,
  checkCircle,
  heart,
  whatsapp,
  ticket,
  audioLines,
  clothes,
  shield,
  paymentMethod,
  uber,
  carFront,
  spotify,
  phone,
  cameraAdd,
  link,
  heartSolid,
} as const;

export type IconKey = keyof typeof icons;
