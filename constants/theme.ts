export const colors = {
  background: "#000000",
  card: "#1b1b1f",
  muted: "#212129",
  mutedForeground: "rgba(245, 244, 242, 0.62)",
  primary: "#f5f4f2",
  accent: "#b24bfb",
  accentPink: "#ea4bc8",
  accentIcon: "#e2b6ff",
  border: "rgba(245, 244, 242, 0.12)",
  success: "#22c55e",
  destructive: "#ef4444",
  subscription: "#123d34",
  money: "#4AE176",
} as const;

export const Colors = {
  light: colors,
  dark: colors,
};

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  18: 72,
  20: 80,
  24: 96,
  30: 120,
} as const;

export const components = {
  tabBar: {
    height: spacing[16],
    horizontalInset: spacing[8],
    radius: spacing[7],
    iconFrame: spacing[10],
    itemPaddingVertical: spacing[10],
  },
} as const;

export const theme = {
  colors,
  spacing,
  components,
} as const;
