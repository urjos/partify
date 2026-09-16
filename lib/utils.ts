import dayjs from "dayjs";

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
