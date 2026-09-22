import dayjs from "dayjs";
import * as WebBrowser from "expo-web-browser";

export const formatCurrency = (value: number, currency = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid()
    ? parsedDate.format("MM/DD/YYYY")
    : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatPeruPhone = (text: string): string => {
  const digits = text.replace(/\D/g, "");
  const clean =
    digits.startsWith("51") && digits.length > 9 ? digits.slice(2) : digits;
  const max = clean.slice(0, 9);

  if (max.length <= 3) return max;
  if (max.length <= 6) return `${max.slice(0, 3)} ${max.slice(3)}`;
  return `${max.slice(0, 3)} ${max.slice(3, 6)} ${max.slice(6)}`;
};

export const getPeruPhoneValidationMessage = (
  rawText: string,
): string | null => {
  if (!rawText || rawText.trim() === "") return null;
  const digits = rawText.replace(/\D/g, "");
  const clean =
    digits.startsWith("51") && digits.length > 9 ? digits.slice(2) : digits;

  if (clean.length === 0) return null;
  if (!clean.startsWith("9")) {
    return "El número debe comenzar con 9 (ej. 987 654 321).";
  }
  if (clean.length < 9) {
    return `Debe tener 9 dígitos (ingresaste ${clean.length}).`;
  }
  return null;
};

export const locationFormattedDistrict = (location?: string): string => {
  if (!location) return "No location identified";
  return location?.split(",").slice(-2, -1)[0]?.trim() || location;
};

export const locationFormattedDistrictAndAddress = (
  location?: string,
): string => {
  if (!location) return "No location identified";
  return (
    location
      ?.split(",")
      .slice(-3, -1)
      .map((s) => s.trim())
      .join(", ") || location
  );
};

export const locationFormattedAddress = (location?: string): string => {
  if (!location) return "No location identified";
  return location?.split(",").slice(-3, -2)[0]?.trim() || location;
};

export const locationFormattedDistrictAndCity = (location?: string): string => {
  if (!location) return "No location identified";
  return (
    location
      ?.split(",")
      .slice(-2)
      .map((s) => s.trim())
      .join(", ") || location
  );
};

export const formatDateProfile = (date?: string): string => {
  if (!date) return "Próximamente";
  return `${dayjs(date).locale("es").format("D/M")} - ${dayjs(date).locale("es").format("h:mm a")}`;
};

export const openBillingPortal = () => {
  return WebBrowser.openBrowserAsync(
    "https://pleased-quail-73.accounts.dev/user/billing/plans",
  );
};
