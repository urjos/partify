export const PLANS = {
  free: "user:free",
  pro: "user:pro",
} as const;

export const FEATURES = {
  unlimitedEvents: "user:unlimited_events",
  eventBoost: "user:event_boost",
  verifiedBadge: "user:verified_badge",
} as const;

export const FREE_ACTIVE_EVENTS_LIMIT = 2;
